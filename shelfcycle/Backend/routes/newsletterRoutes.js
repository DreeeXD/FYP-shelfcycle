const express = require('express');
const { subscribe } = require('../controller/newsletterSubscriber');
const router = express.Router();


router.post('/subscribe', subscribe);



module.exports = router;
