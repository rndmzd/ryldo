require("dotenv").config();
const express = require("express");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const Product = require("./models/Product");
const Character = require("./models/Character");
const User = require("./models/User");
const NewsletterSubscriber = require("./models/NewsletterSubscriber");
const { auth, adminAuth } = require("./middleware/auth");

const app = express();

// Rate Limiting Configuration
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per windowMs for auth routes
  message:
    "Too many authentication attempts, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute for general API routes
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

const publicRoutesLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute for public routes
  message: "Too many requests, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to specific routes
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/auth/check", authLimiter);
app.use("/api/user", apiLimiter);
app.use("/api/admin", apiLimiter);
app.use("/api/products", publicRoutesLimiter);
app.use("/api/characters", publicRoutesLimiter);

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Authentication Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, dateOfBirth } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: { $eq: email } });
    if (existingUser) {
      return res.status(400).json({
        message: "A user with this email already exists",
      });
    }

    // Create new user
    const user = new User({
      email,
      password, // Password will be hashed by the model's pre-save middleware
      firstName,
      lastName,
      dateOfBirth,
      isAdmin: false,
    });

    await user.save();
    console.log("New user created with ID:", user._id);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id.toString() }, // Ensure userId is a string
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    console.log("Token generated for user:", user._id);

    res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: { $eq: email } });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// User Profile Route
app.get("/api/user/profile", auth, async (req, res) => {
  try {
    console.log("Profile request received with user:", req.user?._id);
    const user = await User.findById(req.user._id).select("-password");
    console.log("Found user:", user?._id);
    if (!user) {
      console.log("User not found in database");
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update User Profile Route
app.patch("/api/user/profile", auth, async (req, res) => {
  try {
    const allowedUpdates = [
      "firstName",
      "lastName",
      "email",
      "addresses",
      "phoneNumber",
    ];
    const updates = Object.keys(req.body)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = req.body[key];
        return obj;
      }, {});

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Apply updates
    Object.assign(user, updates);
    await user.save();

    // Return updated user without password
    const updatedUser = await User.findById(user._id).select("-password");
    res.json(updatedUser);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Add new address
app.post("/api/user/addresses", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If this is the first address or isDefault is true, set it as default
    if (user.addresses.length === 0 || req.body.isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    user.addresses.push(req.body);
    await user.save();

    res.status(201).json(user.addresses[user.addresses.length - 1]);
  } catch (error) {
    console.error("Add address error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Update address
app.patch("/api/user/addresses/:addressId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const address = user.addresses.id(req.params.addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // If setting this address as default, unset others
    if (req.body.isDefault) {
      user.addresses.forEach((addr) => (addr.isDefault = false));
    }

    Object.assign(address, req.body);
    await user.save();

    res.json(address);
  } catch (error) {
    console.error("Update address error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Delete address
app.delete("/api/user/addresses/:addressId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const address = user.addresses.id(req.params.addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    address.remove();
    await user.save();

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Delete address error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Set default address
app.patch("/api/user/addresses/:addressId/default", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const address = user.addresses.id(req.params.addressId);
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Set all addresses to non-default
    user.addresses.forEach((addr) => (addr.isDefault = false));
    // Set the selected address as default
    address.isDefault = true;

    await user.save();
    res.json(address);
  } catch (error) {
    console.error("Set default address error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Add auth check endpoint
app.get("/api/auth/check", adminAuth, (req, res) => {
  res.status(200).json({ message: "Authenticated" });
});

// Public Routes
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({ isVisible: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/products/character/:characterId", async (req, res) => {
  try {
    const products = await Product.find({
      character: req.params.characterId,
      isVisible: true,
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/products/category/:category", async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.category,
      isVisible: true,
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/characters", async (req, res) => {
  try {
    const characters = await Character.find();
    res.json(characters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Protected Admin Routes
app.get("/api/admin/products", adminAuth, async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch("/api/admin/products/:id/visibility", adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.isVisible = req.body.isVisible;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch("/api/admin/products/:id/images", adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    product.additionalImages = req.body.additionalImages;
    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.patch("/api/admin/products/:id", adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update all provided fields
    const updateFields = [
      "name",
      "description",
      "price",
      "image",
      "variants",
      "additionalImages",
      "character",
      "category",
      "inStock",
      "isVisible",
    ];

    updateFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Postal Code Validation Route
app.get("/api/validate/postal-code/:postalCode", async (req, res) => {
  try {
    const { postalCode } = req.params;
    const { country } = req.query;

    console.log(
      `Validating postal code: ${postalCode} for country: ${country}`,
    );

    if (!postalCode || !country) {
      console.log("Missing required parameters");
      return res.status(400).json({
        isValid: false,
        message: "Postal code and country are required",
      });
    }

    // US ZIP code validation (5 digits or 5+4 format)
    if (country === "US") {
      const zipRegex = /^\d{5}(-?\d{4})?$/;
      const isValid = zipRegex.test(postalCode);
      console.log(`US ZIP validation result: ${isValid}`);
      return res.json({ isValid });
    } else {
      console.log(`Validation for country ${country} not implemented`);
      // For other countries, return true for now
      return res.json({ isValid: true });
    }
  } catch (error) {
    console.error("Postal code validation error:", error);
    res.status(500).json({
      isValid: false,
      message: "Error validating postal code",
    });
  }
});

// Newsletter Signup Route
app.post("/api/newsletter/subscribe", publicRoutesLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Check if already subscribed
    const existing = await NewsletterSubscriber.findOne({
      email: { $eq: email },
    });
    if (existing) {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    // Create new subscriber
    const subscriber = new NewsletterSubscriber({ email });
    await subscriber.save();

    res.status(201).json({ message: "Successfully subscribed to newsletter" });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    res.status(500).json({ message: "Failed to subscribe to newsletter" });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
