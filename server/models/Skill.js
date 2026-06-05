const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  category: { type: String, required: true, trim: true, maxlength: 100 },
  skills: [{ type: String, trim: true, maxlength: 50 }],
  displayOrder: { type: Number, default: 0 },
  isAdditional: { type: Boolean, default: false }
}, { timestamps: true });

skillSchema.index({ displayOrder: 1 });

module.exports = mongoose.model('Skill', skillSchema);
