const mongoose = require('mongoose');

const investmentDataSchema = new mongoose.Schema({
  totalInvested: {
    type: String,
    required: true,
    default: "92,548,200,000"
  },
  activeInvestments: [{
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ['deposit', 'withdrawal'],
      required: true
    },
    time: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('InvestmentData', investmentDataSchema); 