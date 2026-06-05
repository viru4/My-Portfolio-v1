const express = require('express');
const router = express.Router();
const Social = require('../models/Social');
const { protect } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    let social = await Social.findOne();
    if (!social) {
      social = await Social.create({
        github: '',
        linkedin: '',
        leetcode: '',
        email: ''
      });
    }
    res.json({ success: true, data: social });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.put('/', protect, async (req, res) => {
  try {
    let social = await Social.findOne();
    if (!social) {
      social = new Social(req.body);
    } else {
      Object.assign(social, req.body);
    }
    await social.save();
    res.json({ success: true, data: social });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
