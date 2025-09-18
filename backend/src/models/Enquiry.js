const mongoose = require('mongoose')

const enquirySchema = new mongoose.Schema({
  // Contact Information
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  
  // Enquiry Details
  enquiryType: {
    type: String,
    enum: [
      'Product Enquiry',
      'Technical Support',
      'Bulk Orders',
      'Partnership',
      'Service Request',
      'Complaint/Feedback',
      'Other'
    ],
    default: 'Product Enquiry'
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  
  // Product Information (for product enquiries)
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  productName: {
    type: String,
    trim: true
  },
  productVariant: {
    id: String,
    name: String,
    price: Number,
    sku: String
  },
  
  // Status Management
  status: {
    type: String,
    enum: ['New', 'Contacted', 'In Progress', 'Resolved', 'Closed'],
    default: 'New'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  },
  
  // Admin Notes
  adminNotes: [{
    note: String,
    addedBy: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Contact History
  contactHistory: [{
    method: {
      type: String,
      enum: ['Email', 'Phone', 'WhatsApp', 'Meeting', 'Other']
    },
    details: String,
    contactedBy: String,
    contactedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Source Information
  source: {
    type: String,
    enum: ['Website', 'Phone', 'Email', 'WhatsApp', 'Referral', 'Advertisement', 'Other'],
    default: 'Website'
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
})

// Indexes for better query performance
enquirySchema.index({ status: 1 })
enquirySchema.index({ enquiryType: 1 })
enquirySchema.index({ createdAt: -1 })
enquirySchema.index({ phone: 1 })
enquirySchema.index({ email: 1 })

// Virtual for full contact information
enquirySchema.virtual('fullContact').get(function() {
  return {
    name: this.name,
    email: this.email,
    phone: this.phone,
    company: this.company
  }
})

// Method to add admin note
enquirySchema.methods.addNote = function(note, adminName) {
  this.adminNotes.push({
    note: note,
    addedBy: adminName
  })
  return this.save()
}

// Method to update status
enquirySchema.methods.updateStatus = function(newStatus, adminName) {
  const oldStatus = this.status
  this.status = newStatus
  
  // Add note about status change
  this.adminNotes.push({
    note: `Status changed from ${oldStatus} to ${newStatus}`,
    addedBy: adminName
  })
  
  return this.save()
}

// Method to add contact history
enquirySchema.methods.addContact = function(method, details, contactedBy) {
  this.contactHistory.push({
    method: method,
    details: details,
    contactedBy: contactedBy
  })
  return this.save()
}

// Static method to get enquiries by status
enquirySchema.statics.getByStatus = function(status) {
  return this.find({ status: status }).sort({ createdAt: -1 })
}

// Static method to get enquiries by type
enquirySchema.statics.getByType = function(type) {
  return this.find({ enquiryType: type }).sort({ createdAt: -1 })
}

// Static method to get recent enquiries
enquirySchema.statics.getRecent = function(limit = 10) {
  return this.find().sort({ createdAt: -1 }).limit(limit)
}

module.exports = mongoose.model('Enquiry', enquirySchema)