const mongoose = require('mongoose');

const securityConfigSchema = new mongoose.Schema({
  devToolsProtection: { type: Boolean, default: true },
  consoleProtection: { type: Boolean, default: true },
  rightClickProtection: { type: Boolean, default: true },
  keyboardProtection: { type: Boolean, default: true },
  sourceCodeProtection: { type: Boolean, default: true },
  debuggerProtection: { type: Boolean, default: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('SecurityConfig', securityConfigSchema); 