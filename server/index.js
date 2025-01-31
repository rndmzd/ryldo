require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const Product = require("./models/Product");
const Character = require("./models/Character");
const User = require("./models/User");
const { auth, adminAuth } = require("./middleware/auth");

const app = express();

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
    const existingUser = await User.findOne({ email });
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
    const user = await User.findOne({ email });

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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
