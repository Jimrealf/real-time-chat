const { createMessage, getAllMessages } = require('../models/messageModel');

const postMessage = async (req, res) => {
    const { content } = req.body;
    const userId = req.user.id;

    try {
        console.log('Attempting to create message:', { userId, content });
        const message = await createMessage(userId, content);
        console.log('Message created successfully:', message);
        return res.status(201).json(message);
    } catch (error) {
        console.error('Error in postMessage:', error);
        return res.status(500).json({ error: error.message });
    }
};

const getMessages = async (req, res) => {
    try {
        const messages = await getAllMessages();

        return res.json(messages);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    postMessage,
    getMessages,
};
