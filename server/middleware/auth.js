const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware for any authenticated user
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log('Auth middleware - Token received:', token ? 'yes' : 'no');

        if (!token) {
            throw new Error('No token provided');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Auth middleware - Token decoded:', decoded);

        const user = await User.findById(decoded.userId);
        console.log('Auth middleware - User found:', user?._id);

        if (!user) {
            throw new Error('User not found');
        }

        // Update last login time
        user.lastLogin = new Date();
        await user.save();

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ message: 'Please authenticate' });
    }
};

// Middleware specifically for admin users
const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new Error('No token provided');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user || !user.isAdmin) {
            throw new Error('Not authorized as admin');
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate as admin' });
    }
};

// Middleware to verify age
const ageVerification = async (req, res, next) => {
    try {
        if (!req.user) {
            throw new Error('User not authenticated');
        }

        if (!req.user.isAgeVerified && !req.user.verifyAge()) {
            throw new Error('Age verification required');
        }

        next();
    } catch (error) {
        res.status(403).json({ message: error.message });
    }
};

module.exports = { auth, adminAuth, ageVerification }; 