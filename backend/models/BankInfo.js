const mongoose = require('mongoose');

const bankInfoSchema = new mongoose.Schema({
  bankName: { 
    type: String, 
    required: true,
    trim: true
  },
  accountNumber: { 
    type: String, 
    required: true,
    trim: true
  },
  accountHolder: { 
    type: String, 
    required: true,
    trim: true
  },
  qrCode: { 
    type: String, // URL của hình ảnh QR code
    required: true
  },
  transferContent: {
    type: String,
    trim: true,
    default: ''
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  description: { 
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('BankInfo', bankInfoSchema); 