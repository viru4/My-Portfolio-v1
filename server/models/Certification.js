const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 200 },
  provider: { type: String, required: true, maxlength: 100 },
  url: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Certification', certificationSchema);
