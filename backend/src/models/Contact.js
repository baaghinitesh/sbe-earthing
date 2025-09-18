const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['general', 'product_inquiry', 'quote_request', 'support', 'partnership'],
    default: 'general',
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'resolved', 'closed'],
    default: 'new',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
  },
  adminNotes: [String],
  isRead: {
    type: Boolean,
    default: false,
  },
  source: {
    type: String,
    enum: ['website', 'whatsapp', 'email', 'phone'],
    default: 'website',
  },
  ipAddress: String,
  userAgent: String,
}, {
  timestamps: true,
});

// Index for search and filtering
contactSchema.index({ email: 1, createdAt: -1 });
contactSchema.index({ status: 1, priority: 1 });
contactSchema.index({ type: 1, isRead: 1 });

module.exports = mongoose.model('Contact', contactSchema);