const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'Virendra Kumar' },
  title: { type: String, required: true, default: 'Full Stack Developer' },
  tagline: { type: String, required: true, maxlength: 300 },
  about: { type: String, required: true, maxlength: 5000 },
  statusBadge: {
    text: { type: String, default: 'Open to Work' },
    visible: { type: Boolean, default: true }
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
