const express = require('express');
const router = express.Router();
const authenticationToken = require('../middleware/authenticationToken');

const sendMessage = require('../controller/sendMessage');
const getMessages = require('../controller/getMessage');

router.post('/', authenticationToken, sendMessage);
router.get('/:userId', authenticationToken, getMessages);

module.exports = router;
