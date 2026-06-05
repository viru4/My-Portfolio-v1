const mongoose = require('mongoose');

const socialSchema = new mongoose.Schema({
  github: { type: String },
  linkedin: { type: String },
  leetcode: { type: String },
  email: { type: String },
  custom: [{
    label: { type: String, maxlength: 50 },
    url: { type: String }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Social', socialSchema);
