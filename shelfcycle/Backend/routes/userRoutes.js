const express = require('express');
const User = require('../models/userModel');
const authenticationToken = require('../middleware/authenticationToken');

const router = express.Router();

router.get('/', authenticationToken, async (req, res) => {
    console.log('/api/users hit by', req.user);
  try {
    const users = await User.find({}, '_id username');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
