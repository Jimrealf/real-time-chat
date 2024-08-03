const express = require('express');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
// const swaggerSetup = require('./swagger');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// swaggerSetup(app);

app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

module.exports = app;
