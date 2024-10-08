const { createUser, findUserByUsername } = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await createUser(username, password);

        res.status(201).json(user);
    } catch (error) {
        console.error('Error in register:', error);
        if (error.constraint === 'users_username_key') {
            return res.status(400).json({ error: 'Username already exists' });
        }
        res.status(500).json({
            error: 'Internal server error',
            details: error.message,
        });
    }
};

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await findUserByUsername(username);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Wrong username/password' });
        }
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });
        return res.json({ token });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    register,
    login,
};
