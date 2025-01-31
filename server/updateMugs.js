const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const Product = require("./models/Product");

async function updateMugs() {
  try {
    // Connect to MongoDB with replica set options
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
      w: "majority",
    });
    console.log("Connected to MongoDB");

    // Find all drinkware products that contain "Mug" in their name
    const mugs = await Product.find({
      category: "Drinkware",
      name: /Mug/,
    });
    console.log(`Found ${mugs.length} mugs to update`);

    // Update each mug with size variants
    for (const mug of mugs) {
      const basePrice = mug.price;

      await Product.updateOne(
        { _id: mug._id },
        {
          $set: {
            hasVariants: true,
            variants: [
              {
                size: "Small (8 oz)",
                price: basePrice,
                inStock: true,
              },
              {
                size: "Medium (12 oz)",
                price: basePrice + 2,
                inStock: true,
              },
              {
                size: "Large (16 oz)",
                price: basePrice + 4,
                inStock: true,
              },
            ],
          },
        },
        { writeConcern: { w: "majority" } },
      );
      console.log(`Updated mug: ${mug.name}`);
    }

    console.log("Successfully updated all mugs with size variants");
    process.exit(0);
  } catch (error) {
    console.error("Error updating mugs:", error);
    process.exit(1);
  }
}

updateMugs();
