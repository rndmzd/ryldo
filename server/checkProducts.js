const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const Product = require("./models/Product");

async function checkProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: "majority",
    });
    console.log("Connected to MongoDB");

    const products = await Product.find({});
    console.log("All products:");
    products.forEach((product) => {
      console.log(`Name: ${product.name}, Category: ${product.category}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkProducts();
