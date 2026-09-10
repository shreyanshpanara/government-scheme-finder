const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/aiController');
const { optionalAuth } = require('../middleware/authMiddleware');

router.post('/chat', optionalAuth, chat);

module.exports = router;
