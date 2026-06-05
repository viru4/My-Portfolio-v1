const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 1000 },
  highlights: [{ type: String, maxlength: 300 }],
  techStack: [{ type: String, trim: true, maxlength: 50 }],
  githubUrl: { type: String },
  demoUrl: { type: String },
  thumbnail: { type: String },
  displayOrder: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  isMLProject: { type: Boolean, default: false }
}, { timestamps: true });

projectSchema.index({ displayOrder: 1 });
projectSchema.index({ isMLProject: 1, displayOrder: 1 });

module.exports = mongoose.model('Project', projectSchema);
