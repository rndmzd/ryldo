require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");
const Character = require("./models/Character");

const { CHARACTERS, products } = require("../src/data/products");

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await Promise.all([Product.deleteMany({}), Character.deleteMany({})]);
    console.log("Cleared existing data");

    // Insert characters
    const characters = Object.values(CHARACTERS);
    await Character.insertMany(characters);
    console.log("Inserted characters");

    // Insert products
    await Product.insertMany(products);
    console.log("Inserted products");

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
