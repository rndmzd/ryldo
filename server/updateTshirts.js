const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const Product = require("./models/Product");

async function updateTshirts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: "majority",
    });
    console.log("Connected to MongoDB");

    // Find all t-shirts in both categories
    const tshirts = await Product.find({
      $and: [
        { name: /T-Shirt/ },
        { $or: [{ category: "Apparel" }, { category: "Stream Merchandise" }] },
      ],
    });
    console.log(`Found ${tshirts.length} t-shirts to update`);

    // Update each t-shirt with size and color variants
    for (const tshirt of tshirts) {
      const basePrice = tshirt.price;
      const variants = [];

      // Colors available
      const colors = ["Black", "White", "Navy", "Gray"];

      // Create variants for each color and size combination
      colors.forEach((color) => {
        [
          { size: "XS", price: basePrice },
          { size: "Small", price: basePrice },
          { size: "Medium", price: basePrice },
          { size: "Large", price: basePrice },
          { size: "XL", price: basePrice },
          { size: "2XL", price: basePrice + 2 },
          { size: "3XL", price: basePrice + 4 },
        ].forEach(({ size, price }) => {
          variants.push({
            size: size,
            color: color,
            price: price,
            inStock: true,
          });
        });
      });

      await Product.updateOne(
        { _id: tshirt._id },
        {
          $set: {
            hasVariants: true,
            variants: variants,
          },
        },
        { writeConcern: { w: "majority" } },
      );
      console.log(`Updated t-shirt: ${tshirt.name} (${tshirt.category})`);
    }

    console.log(
      "Successfully updated all t-shirts with size and color variants",
    );
    process.exit(0);
  } catch (error) {
    console.error("Error updating t-shirts:", error);
    process.exit(1);
  }
}

updateTshirts();
