const express = require('express');
const { postMessage, getMessages } = require('../controller/chatController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authenticateToken, postMessage);
router.get('/', authenticateToken, getMessages);

module.exports = router;
