const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  period: { type: String, required: true, maxlength: 50 },
  degree: { type: String, required: true, maxlength: 150 },
  institution: { type: String, required: true, maxlength: 200 },
  location: { type: String, maxlength: 100 },
  score: { type: String, maxlength: 20 },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

educationSchema.index({ displayOrder: 1 });

module.exports = mongoose.model('Education', educationSchema);
