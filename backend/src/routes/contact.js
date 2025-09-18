const express = require('express');
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
router.post('/', [
  body('name').trim().isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail(),
  body('phone').trim().isLength({ min: 10, max: 20 }),
  body('subject').trim().isLength({ min: 5, max: 200 }),
  body('message').trim().isLength({ min: 10, max: 1000 }),
  body('type').optional().isIn(['general', 'product_inquiry', 'quote_request', 'support', 'partnership']),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid information',
        errors: errors.array(),
      });
    }

    const contactData = {
      ...req.body,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      source: 'website',
    };

    const contact = await Contact.create(contactData);

    // TODO: Send email notification to admin
    // TODO: Send auto-reply email to user

    res.status(201).json({
      success: true,
      message: 'Thank you for your inquiry. We will get back to you soon.',
      data: {
        id: contact._id,
        submittedAt: contact.createdAt,
      },
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error submitting contact form',
    });
  }
});

// @desc    Get all contact submissions (Admin)
// @route   GET /api/contact
// @access  Private (Admin)
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    if (req.query.type) {
      query.type = req.query.type;
    }
    
    if (req.query.isRead !== undefined) {
      query.isRead = req.query.isRead === 'true';
    }

    const contacts = await Contact.find(query)
      .populate('productId', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(query);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
        },
      },
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching contacts',
    });
  }
});

// @desc    Get single contact submission (Admin)
// @route   GET /api/contact/:id
// @access  Private (Admin)
router.get('/:id', protect, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id)
      .populate('productId', 'name slug images');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found',
      });
    }

    // Mark as read
    if (!contact.isRead) {
      contact.isRead = true;
      await contact.save();
    }

    res.json({
      success: true,
      data: contact,
    });
  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching contact',
    });
  }
});

// @desc    Update contact status (Admin)
// @route   PUT /api/contact/:id
// @access  Private (Admin)
router.put('/:id', protect, [
  body('status').optional().isIn(['new', 'in_progress', 'resolved', 'closed']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('adminNotes').optional().isArray(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid update data',
        errors: errors.array(),
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('productId', 'name slug');

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found',
      });
    }

    res.json({
      success: true,
      data: contact,
      message: 'Contact updated successfully',
    });
  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating contact',
    });
  }
});

// @desc    Delete contact submission (Admin)
// @route   DELETE /api/contact/:id
// @access  Private (Admin)
router.delete('/:id', protect, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact submission not found',
      });
    }

    await contact.deleteOne();

    res.json({
      success: true,
      message: 'Contact submission deleted successfully',
    });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting contact',
    });
  }
});

module.exports = router;