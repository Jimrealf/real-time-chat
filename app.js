const express = require('express');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const setupSwaggerDocs = require('./swagger');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

setupSwaggerDocs(app);

module.exports = app;
