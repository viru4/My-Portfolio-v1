const express = require('express');
const router = express.Router();
const Education = require('../models/Education');
const { protect } = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/', async (req, res) => {
  try {
    const edu = await Education.find().sort({ displayOrder: 1 });
    res.json({ success: true, count: edu.length, data: edu });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const edu = await Education.create(req.body);
    res.status(201).json({ success: true, data: edu });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/:id', protect, validateObjectId, async (req, res) => {
  try {
    const edu = await Education.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!edu) return res.status(404).json({ success: false, error: 'Education entry not found' });
    res.json({ success: true, data: edu });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id', protect, validateObjectId, async (req, res) => {
  try {
    const edu = await Education.findByIdAndDelete(req.params.id);
    if (!edu) return res.status(404).json({ success: false, error: 'Education entry not found' });
    res.json({ success: true, message: 'Education entry removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
