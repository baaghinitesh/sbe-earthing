const mongoose = require('mongoose');

const themeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  colors: {
    primary: {
      50: String,
      100: String,
      200: String,
      300: String,
      400: String,
      500: String,
      600: String,
      700: String,
      800: String,
      900: String,
    },
    secondary: {
      50: String,
      100: String,
      200: String,
      300: String,
      400: String,
      500: String,
      600: String,
      700: String,
      800: String,
      900: String,
    },
    accent: {
      50: String,
      100: String,
      200: String,
      300: String,
      400: String,
      500: String,
      600: String,
      700: String,
      800: String,
      900: String,
    },
    neutral: {
      50: String,
      100: String,
      200: String,
      300: String,
      400: String,
      500: String,
      600: String,
      700: String,
      800: String,
      900: String,
    },
  },
  fonts: {
    primary: String,
    secondary: String,
    monospace: String,
  },
  settings: {
    defaultMode: {
      type: String,
      enum: ['light', 'dark'],
      default: 'dark',
    },
    enableAnimations: {
      type: Boolean,
      default: true,
    },
    enableGlassEffects: {
      type: Boolean,
      default: true,
    },
    borderRadius: {
      type: String,
      enum: ['none', 'small', 'medium', 'large', 'full'],
      default: 'medium',
    },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Theme', themeSchema);