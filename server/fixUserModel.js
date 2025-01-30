require('dotenv').config();
const mongoose = require('mongoose');

async function fixUserModel() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection;

        // Drop the username index
        await db.collection('users').dropIndex('username_1');
        console.log('Successfully dropped username index');

        console.log('Database fix completed');
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

fixUserModel(); 