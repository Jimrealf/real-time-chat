const express = require('express');
const { postMessage, getMessages } = require('../controller/chatController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Post a new message
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 description: The message content.
 *     responses:
 *       201:
 *         description: Message posted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, postMessage);

/**
 * @swagger
 * /api/chat:
 *   get:
 *     summary: Get all messages
 *     tags: [Chat]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of messages
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   user_id:
 *                     type: string
 *                   content:
 *                     type: string
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                   username:
 *                     type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateToken, getMessages);

module.exports = router;
