const pool = require('./db');
const { formatDate } = require('../utils/date');

const createMessage = async (userId, content) => {
    try {
        const currentDate = new Date();
        const formattedDate = formatDate(currentDate);
        console.log('Executing query with params:', { userId, content, formattedDate });

        const res = await pool.query(
            'INSERT INTO messages (user_id, content, created_at) VALUES ($1, $2, $3) RETURNING *',
            [userId, content, formattedDate]
        );
        console.log('Query result:', res.rows[0]);

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
    console.log('getAllMessages result:', res.rows);
    return res.rows;
};

module.exports = {
    createMessage,
    getAllMessages,
};
