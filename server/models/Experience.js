const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 150 },
  company: { type: String, required: true, maxlength: 100 },
  companyUrl: { type: String },
  duration: { type: String, required: true, maxlength: 100 },
  description: [{ type: String, maxlength: 500 }],
  techStack: [{ type: String, trim: true, maxlength: 50 }],
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

experienceSchema.index({ displayOrder: 1 });

module.exports = mongoose.model('Experience', experienceSchema);
