const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  position: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  avatar: { 
    type: String 
  },
  email: { 
    type: String 
  },
  phone: { 
    type: String 
  },
  linkedin: { 
    type: String 
  },
  experience: { 
    type: String 
  },
  education: { 
    type: String 
  },
  achievements: [{ 
    type: String 
  }],
  order: { 
    type: Number, 
    default: 0 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  color: { 
    type: String, 
    default: 'blue' 
  }
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema); 