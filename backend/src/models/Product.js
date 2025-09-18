const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  specifications: [{
    key: String,
    value: String,
  }],
  images: [String],
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  shortDescription: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Copper Earthing Electrodes',
      'Chemical Earthing Electrodes',
      'Maintenance Free Earthing Electrodes',
      'Earthing Compounds',
      'Earthing Accessories',
      'Lightning Protection Systems',
      'Grounding Systems',
      'Other'
    ],
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false,
    },
  }],
  variants: [variantSchema],
  specifications: [{
    key: String,
    value: String,
  }],
  features: [String],
  applications: [String],
  certifications: [String],
  manualPdf: String, // PDF download link
  tags: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String],
  views: {
    type: Number,
    default: 0,
  },
  rating: {
    average: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    },
  },
}, {
  timestamps: true,
});

// Index for search functionality
productSchema.index({ 
  name: 'text', 
  description: 'text', 
  shortDescription: 'text',
  tags: 'text'
});

// Generate slug from name before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);