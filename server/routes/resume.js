const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect } = require('../middleware/auth');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Keep it static as resume.pdf for direct references
    cb(null, 'resume.pdf');
  }
});

// Enforce PDF only and file limits
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = file.mimetype === 'application/pdf';

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF documents are allowed!'));
    }
  }
});

// @desc    Upload PDF resume
// @route   POST /api/resume/upload
// @access  Private
router.post('/upload', protect, (req, res) => {
  upload.single('resume')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const message = err.code === 'LIMIT_FILE_SIZE'
        ? 'File too large. Maximum size is 5MB.'
        : err.message;
      return res.status(400).json({ success: false, error: message });
    }
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please choose a PDF file to upload' });
    }
    res.json({
      success: true,
      message: 'Resume PDF uploaded successfully!',
      filename: req.file.filename
    });
  });
});

// @desc    Download current PDF resume
// @route   GET /api/resume/download
// @access  Public
router.get('/download', (req, res) => {
  const file = path.join(__dirname, '../uploads/resume.pdf');
  if (fs.existsSync(file)) {
    res.download(file, 'Virendra_Kumar_Resume.pdf');
  } else {
    res.status(404).json({ success: false, error: 'Resume PDF has not been uploaded yet' });
  }
});

module.exports = router;
