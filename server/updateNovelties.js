const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const mongoose = require('mongoose');
const Product = require('./models/Product');

async function updateNovelties() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
            w: 'majority'
        });
        console.log('Connected to MongoDB');

        // Base product data
        const noveltyProducts = [
            {
                id: 'novelty-001',
                name: 'Adult Novelty Item',
                price: 29.99,
                category: 'Adult Novelties',
                description: 'A high-quality adult novelty item.',
                image: '/images/novelties/novelty-001.jpg',
                hasVariants: true,
                isVisible: false, // Set to false by default for admin review
                variants: []
            }
        ];

        // Create or update each novelty product
        for (const product of noveltyProducts) {
            const variants = [];
            
            // Define standard variations
            const variations = [
                { size: 'Standard', price: product.price },
                { size: 'Large', price: product.price + 10 }
            ];

            // Create variants
            variations.forEach(({ size, price }) => {
                variants.push({
                    size: size,
                    price: price,
                    inStock: true
                });
            });

            // Update or create the product
            await Product.findOneAndUpdate(
                { id: product.id },
                {
                    ...product,
                    variants: variants
                },
                {
                    upsert: true,
                    new: true,
                    writeConcern: { w: 'majority' }
                }
            );
            console.log(`Updated/created novelty product: ${product.name}`);
        }

        console.log('Successfully updated all novelty products');
        process.exit(0);
    } catch (error) {
        console.error('Error updating novelty products:', error);
        process.exit(1);
    }
}

updateNovelties(); 