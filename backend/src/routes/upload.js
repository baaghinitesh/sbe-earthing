const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Ensure upload directories exist
const ensureDirectories = () => {
  const dirs = [
    'uploads',
    'uploads/products',
    'uploads/gallery',
    'uploads/pdfs',
  ];
  
  dirs.forEach(dir => {
    const fullPath = path.join(__dirname, '../../', dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
};

ensureDirectories();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'uploads/';
    
    if (file.fieldname === 'productImage') {
      uploadPath += 'products/';
    } else if (file.fieldname === 'galleryImage') {
      uploadPath += 'gallery/';
    } else if (file.fieldname === 'pdf') {
      uploadPath += 'pdfs/';
    }
    
    cb(null, path.join(__dirname, '../../', uploadPath));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const allowedPdfTypes = ['application/pdf'];
  
  if (file.fieldname === 'pdf') {
    if (allowedPdfTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed for documents'), false);
    }
  } else {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, PNG, and WebP images are allowed'), false);
    }
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB default
  },
});

// @desc    Upload product image
// @route   POST /api/upload/product-image
// @access  Private (Admin)
router.post('/product-image', protect, upload.single('productImage'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const fileUrl = `/uploads/products/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Product image uploaded successfully',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        url: fileUrl,
      },
    });
  } catch (error) {
    console.error('Upload product image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error uploading image',
    });
  }
});

// @desc    Upload multiple product images
// @route   POST /api/upload/product-images
// @access  Private (Admin)
router.post('/product-images', protect, upload.array('productImages', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
      });
    }

    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      url: `/uploads/products/${file.filename}`,
    }));

    res.json({
      success: true,
      message: `${req.files.length} images uploaded successfully`,
      data: uploadedFiles,
    });
  } catch (error) {
    console.error('Upload product images error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error uploading images',
    });
  }
});

// @desc    Upload PDF manual
// @route   POST /api/upload/pdf
// @access  Private (Admin)
router.post('/pdf', protect, upload.single('pdf'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No PDF file uploaded',
      });
    }

    const fileUrl = `/uploads/pdfs/${req.file.filename}`;

    res.json({
      success: true,
      message: 'PDF uploaded successfully',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        url: fileUrl,
      },
    });
  } catch (error) {
    console.error('Upload PDF error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error uploading PDF',
    });
  }
});

// @desc    Upload gallery image
// @route   POST /api/upload/gallery-image
// @access  Private (Admin)
router.post('/gallery-image', protect, upload.single('galleryImage'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const fileUrl = `/uploads/gallery/${req.file.filename}`;

    res.json({
      success: true,
      message: 'Gallery image uploaded successfully',
      data: {
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size,
        url: fileUrl,
      },
    });
  } catch (error) {
    console.error('Upload gallery image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error uploading image',
    });
  }
});

// @desc    Delete uploaded file
// @route   DELETE /api/upload/:filename
// @access  Private (Admin)
router.delete('/:filename', protect, (req, res) => {
  try {
    const filename = req.params.filename;
    
    // Search for the file in different upload directories
    const possiblePaths = [
      path.join(__dirname, '../../uploads/products/', filename),
      path.join(__dirname, '../../uploads/gallery/', filename),
      path.join(__dirname, '../../uploads/pdfs/', filename),
    ];

    let fileFound = false;
    
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        fileFound = true;
        break;
      }
    }

    if (!fileFound) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
      });
    }

    res.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting file',
    });
  }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 10MB.',
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum is 10 files.',
      });
    }
  }
  
  if (error.message) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  
  next(error);
});

module.exports = router;