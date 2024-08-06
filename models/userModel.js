const pool = require('./db');
const bcrypt = require('bcryptjs');

const createUser = async (username, password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const res = await pool.query(
            'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
            [username, hashedPassword]
        );
        return res.rows[0];
    } catch (error) {
        throw error;
    }
};

const findUserByUsername = async (username) => {
    const res = await pool.query('SELECT * FROM users WHERE username = $1', [
        username,
    ]);
    return res.rows[0];
};

module.exports = {
    createUser,
    findUserByUsername,
};
