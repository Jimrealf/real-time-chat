const pool = require('./db');
const { formatDate } = require('../utils/date');

const createMessage = async (userId, content) => {
    try {
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);

        const res = await pool.query(
            'INSERT INTO messages (user_id, content, created_at) VALUES ($1, $2, $3) RETURNING *',
            [userId, content, formattedDate]
        );

        return res.rows[0];

    } catch (error) {
        console.error('Error creating message:', error);
    
        throw error;
    }
};

const getAllMessages = async () => {
    const res = await pool.query(
        'SELECT messages.*, users.username FROM messages JOIN users ON messages.user_id = users.id ORDER BY created_at ASC'
    );

    return res.rows;
};

module.exports = {
    createMessage,
    getAllMessages,
};
