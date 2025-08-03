const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo'
});

// Cấu hình storage cho Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'zuna-uploads',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 800, height: 600, crop: 'limit' },
      { quality: 'auto' }
    ]
  }
});

// Cấu hình storage cho identity verification
const identityStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'identity-verification',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 800, height: 600, crop: 'limit' },
      { quality: 'auto' }
    ]
  }
});

// Middleware upload với Cloudinary
const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    // Kiểm tra loại file
    if (file.mimetype.startsWith('image/')) {
      // Kiểm tra extension
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const fileExtension = path.extname(file.originalname).toLowerCase();
      
      if (allowedExtensions.includes(fileExtension)) {
        cb(null, true);
      } else {
        cb(new Error('Chỉ hỗ trợ file ảnh: JPG, JPEG, PNG, GIF, WEBP!'), false);
      }
    } else {
      cb(new Error('Chỉ hỗ trợ file ảnh!'), false);
    }
  }
});

// Middleware upload cho nhiều file
const uploadMultiple = multer({
  storage: storage,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const fileExtension = path.extname(file.originalname).toLowerCase();
      
      if (allowedExtensions.includes(fileExtension)) {
        cb(null, true);
      } else {
        cb(new Error('Chỉ hỗ trợ file ảnh: JPG, JPEG, PNG, GIF, WEBP!'), false);
      }
    } else {
      cb(new Error('Chỉ hỗ trợ file ảnh!'), false);
    }
  }
});

// Middleware upload cho identity verification
const uploadIdentity = multer({
  storage: identityStorage,
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const fileExtension = path.extname(file.originalname).toLowerCase();
      
      if (allowedExtensions.includes(fileExtension)) {
        cb(null, true);
      } else {
        cb(new Error('Chỉ hỗ trợ file ảnh: JPG, JPEG, PNG, GIF, WEBP!'), false);
      }
    } else {
      cb(new Error('Chỉ hỗ trợ file ảnh!'), false);
    }
  }
});

// Fallback storage local nếu không có Cloudinary
const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = 'uploads/temp/';
    const fs = require('fs');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + path.extname(file.originalname);
    cb(null, filename);
  },
});

const uploadLocal = multer({
  storage: localStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const fileExtension = path.extname(file.originalname).toLowerCase();
      
      if (allowedExtensions.includes(fileExtension)) {
        cb(null, true);
      } else {
        cb(new Error('Chỉ hỗ trợ file ảnh: JPG, JPEG, PNG, GIF, WEBP!'), false);
      }
    } else {
      cb(new Error('Chỉ hỗ trợ file ảnh!'), false);
    }
  },
});

module.exports = {
  upload,
  uploadMultiple,
  uploadIdentity,
  uploadLocal,
  cloudinary
}; 