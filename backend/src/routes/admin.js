const express = require('express');
const { body, validationResult } = require('express-validator');
const FAQ = require('../models/FAQ');
const Theme = require('../models/Theme');
const Product = require('../models/Product');
const Contact = require('../models/Contact');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
router.get('/dashboard', protect, async (req, res) => {
  try {
    const [
      totalProducts,
      totalContacts,
      totalFAQs,
      recentContacts,
      popularProducts,
      contactsByType
    ] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Contact.countDocuments(),
      FAQ.countDocuments({ isActive: true }),
      Contact.find().sort({ createdAt: -1 }).limit(5).populate('productId', 'name slug'),
      Product.find({ isActive: true }).sort({ views: -1 }).limit(5).select('name views images'),
      Contact.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 } } }
      ])
    ]);

    const stats = {
      totalProducts,
      totalContacts,
      totalFAQs,
      recentContacts,
      popularProducts,
      contactsByType: contactsByType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard stats',
    });
  }
});

// FAQ Routes

// @desc    Get all FAQs
// @route   GET /api/admin/faqs
// @access  Public
router.get('/faqs', async (req, res) => {
  try {
    const category = req.query.category;
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }

    const faqs = await FAQ.find(query)
      .sort({ order: 1, createdAt: -1 })
      .select('-__v');

    res.json({
      success: true,
      data: faqs,
    });
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching FAQs',
    });
  }
});

// @desc    Create FAQ
// @route   POST /api/admin/faqs
// @access  Private (Admin)
router.post('/faqs', protect, [
  body('question').trim().isLength({ min: 5, max: 500 }),
  body('answer').trim().isLength({ min: 10, max: 2000 }),
  body('category').isIn([
    'General', 'Products', 'Installation', 'Maintenance', 
    'Technical', 'Pricing', 'Warranty', 'Shipping', 'Other'
  ]),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array(),
      });
    }

    const faq = await FAQ.create(req.body);

    res.status(201).json({
      success: true,
      data: faq,
      message: 'FAQ created successfully',
    });
  } catch (error) {
    console.error('Create FAQ error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating FAQ',
    });
  }
});

// @desc    Update FAQ
// @route   PUT /api/admin/faqs/:id
// @access  Private (Admin)
router.put('/faqs/:id', protect, async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }

    res.json({
      success: true,
      data: faq,
      message: 'FAQ updated successfully',
    });
  } catch (error) {
    console.error('Update FAQ error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating FAQ',
    });
  }
});

// @desc    Delete FAQ
// @route   DELETE /api/admin/faqs/:id
// @access  Private (Admin)
router.delete('/faqs/:id', protect, async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }

    await faq.deleteOne();

    res.json({
      success: true,
      message: 'FAQ deleted successfully',
    });
  } catch (error) {
    console.error('Delete FAQ error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting FAQ',
    });
  }
});

// Theme Routes

// @desc    Get current theme
// @route   GET /api/admin/theme
// @access  Public
router.get('/theme', async (req, res) => {
  try {
    const theme = await Theme.findOne({ isActive: true });

    if (!theme) {
      // Return default theme if none exists
      return res.json({
        success: true,
        data: {
          name: 'default',
          settings: {
            defaultMode: 'dark',
            enableAnimations: true,
            enableGlassEffects: true,
            borderRadius: 'medium',
          },
        },
      });
    }

    res.json({
      success: true,
      data: theme,
    });
  } catch (error) {
    console.error('Get theme error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching theme',
    });
  }
});

// @desc    Update theme
// @route   PUT /api/admin/theme
// @access  Private (Admin)
router.put('/theme', protect, async (req, res) => {
  try {
    let theme = await Theme.findOne({ isActive: true });

    if (!theme) {
      // Create new theme if none exists
      theme = await Theme.create({
        ...req.body,
        isActive: true,
      });
    } else {
      // Update existing theme
      Object.assign(theme, req.body);
      await theme.save();
    }

    res.json({
      success: true,
      data: theme,
      message: 'Theme updated successfully',
    });
  } catch (error) {
    console.error('Update theme error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating theme',
    });
  }
});

module.exports = router;