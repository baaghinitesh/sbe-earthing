const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'General',
      'Products',
      'Installation',
      'Maintenance',
      'Technical',
      'Pricing',
      'Warranty',
      'Shipping',
      'Other'
    ],
    default: 'General',
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  helpful: {
    yes: {
      type: Number,
      default: 0,
    },
    no: {
      type: Number,
      default: 0,
    },
  },
  relatedProducts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  }],
  seoKeywords: [String],
}, {
  timestamps: true,
});

// Index for search functionality
faqSchema.index({ 
  question: 'text', 
  answer: 'text',
  tags: 'text'
});

faqSchema.index({ category: 1, order: 1 });
faqSchema.index({ isActive: 1, order: 1 });

module.exports = mongoose.model('FAQ', faqSchema);