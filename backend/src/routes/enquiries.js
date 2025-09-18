const express = require('express')
const router = express.Router()
const Enquiry = require('../models/Enquiry')
const auth = require('../middleware/auth')

// @route   POST /api/enquiries
// @desc    Create new enquiry
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      enquiryType,
      subject,
      message,
      productName,
      productVariant,
      source
    } = req.body

    // Validate required fields
    if (!name || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, subject, and message are required'
      })
    }

    // Create enquiry object
    const enquiryData = {
      name: name.trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
      enquiryType: enquiryType || 'Product Enquiry',
      source: source || 'Website',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    }

    // Add optional fields if provided
    if (email) enquiryData.email = email.trim().toLowerCase()
    if (company) enquiryData.company = company.trim()
    if (productName) enquiryData.productName = productName.trim()
    if (productVariant) enquiryData.productVariant = productVariant

    // Create new enquiry
    const enquiry = new Enquiry(enquiryData)
    await enquiry.save()

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully',
      data: {
        id: enquiry._id,
        name: enquiry.name,
        subject: enquiry.subject,
        status: enquiry.status,
        createdAt: enquiry.createdAt
      }
    })

  } catch (error) {
    console.error('Error creating enquiry:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while submitting enquiry'
    })
  }
})

// @route   GET /api/enquiries
// @desc    Get all enquiries (Admin only)
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      status,
      type,
      priority,
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query

    // Build query
    let query = {}
    
    if (status && status !== 'all') {
      query.status = status
    }
    
    if (type && type !== 'all') {
      query.enquiryType = type
    }
    
    if (priority && priority !== 'all') {
      query.priority = priority
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ]
    }

    // Setup pagination
    const pageNum = parseInt(page)
    const limitNum = parseInt(limit)
    const skip = (pageNum - 1) * limitNum

    // Setup sorting
    const sort = {}
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1

    // Execute query
    const enquiries = await Enquiry.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .populate('productId', 'name category')

    // Get total count for pagination
    const total = await Enquiry.countDocuments(query)

    // Calculate pagination info
    const totalPages = Math.ceil(total / limitNum)
    const hasNextPage = pageNum < totalPages
    const hasPrevPage = pageNum > 1

    res.json({
      success: true,
      data: {
        enquiries,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum,
          hasNextPage,
          hasPrevPage
        }
      }
    })

  } catch (error) {
    console.error('Error fetching enquiries:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching enquiries'
    })
  }
})

// @route   GET /api/enquiries/stats
// @desc    Get enquiry statistics (Admin only)
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    // Get counts by status
    const statusStats = await Enquiry.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ])

    // Get counts by type
    const typeStats = await Enquiry.aggregate([
      {
        $group: {
          _id: '$enquiryType',
          count: { $sum: 1 }
        }
      }
    ])

    // Get recent enquiries count (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentCount = await Enquiry.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    })

    // Get total enquiries
    const totalCount = await Enquiry.countDocuments()

    res.json({
      success: true,
      data: {
        total: totalCount,
        recent: recentCount,
        byStatus: statusStats,
        byType: typeStats
      }
    })

  } catch (error) {
    console.error('Error fetching enquiry stats:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics'
    })
  }
})

// @route   GET /api/enquiries/:id
// @desc    Get single enquiry (Admin only)
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
      .populate('productId', 'name category images')

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      })
    }

    res.json({
      success: true,
      data: enquiry
    })

  } catch (error) {
    console.error('Error fetching enquiry:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while fetching enquiry'
    })
  }
})

// @route   PUT /api/enquiries/:id/status
// @desc    Update enquiry status (Admin only)
// @access  Private
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body
    const adminName = req.admin.name || 'Admin'

    const enquiry = await Enquiry.findById(req.params.id)
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      })
    }

    await enquiry.updateStatus(status, adminName)

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: {
        id: enquiry._id,
        status: enquiry.status
      }
    })

  } catch (error) {
    console.error('Error updating enquiry status:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while updating status'
    })
  }
})

// @route   POST /api/enquiries/:id/notes
// @desc    Add note to enquiry (Admin only)
// @access  Private
router.post('/:id/notes', auth, async (req, res) => {
  try {
    const { note } = req.body
    const adminName = req.admin.name || 'Admin'

    if (!note || !note.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Note content is required'
      })
    }

    const enquiry = await Enquiry.findById(req.params.id)
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      })
    }

    await enquiry.addNote(note.trim(), adminName)

    res.json({
      success: true,
      message: 'Note added successfully',
      data: {
        id: enquiry._id,
        notes: enquiry.adminNotes
      }
    })

  } catch (error) {
    console.error('Error adding note:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while adding note'
    })
  }
})

// @route   POST /api/enquiries/:id/contact
// @desc    Add contact history to enquiry (Admin only)
// @access  Private
router.post('/:id/contact', auth, async (req, res) => {
  try {
    const { method, details } = req.body
    const adminName = req.admin.name || 'Admin'

    if (!method || !details) {
      return res.status(400).json({
        success: false,
        message: 'Contact method and details are required'
      })
    }

    const enquiry = await Enquiry.findById(req.params.id)
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      })
    }

    await enquiry.addContact(method, details.trim(), adminName)

    res.json({
      success: true,
      message: 'Contact history added successfully',
      data: {
        id: enquiry._id,
        contactHistory: enquiry.contactHistory
      }
    })

  } catch (error) {
    console.error('Error adding contact history:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while adding contact history'
    })
  }
})

// @route   DELETE /api/enquiries/:id
// @desc    Delete enquiry (Admin only)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found'
      })
    }

    await enquiry.deleteOne()

    res.json({
      success: true,
      message: 'Enquiry deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting enquiry:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while deleting enquiry'
    })
  }
})

module.exports = router