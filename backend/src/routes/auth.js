const express = require('express');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const { generateToken } = require('../middleware/auth');

const router = express.Router();

// @desc    Admin login
// @route   POST /api/auth/login
// @access  Public
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid email and password',
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is inactive',
      });
    }

    // Check password
    const isMatch = await admin.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    res.json({
      success: true,
      data: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
});

// @desc    Initialize default admin (run once)
// @route   POST /api/auth/init
// @access  Public (should be restricted in production)
router.post('/init', async (req, res) => {
  try {
    // Check if any admin exists
    const existingAdmin = await Admin.findOne({});
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists',
      });
    }

    // Create default admin
    const admin = await Admin.create({
      email: process.env.ADMIN_EMAIL || 'baaghinitesh@gmail.com',
      password: process.env.ADMIN_PASSWORD || 'nitesh@123',
      name: 'SBE Earthing Admin',
      role: 'admin',
    });

    res.status(201).json({
      success: true,
      message: 'Default admin created successfully',
      data: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error('Init admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin initialization',
    });
  }
});

module.exports = router;