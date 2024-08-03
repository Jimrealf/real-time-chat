const app = require('./app');
const http = require('http');
const socketIo = require('socket.io');
const { authenticateToken } = require('./middleware/authMiddleware');
const { createMessage, getAllMessages } = require('./models/messageModel');

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
    },
});

io.use((socket, next) => {
    const token = socket.handshake.headers.authorization?.split(' ')[1];
    if (!token) {
        return next(new Error('Authentication error'));
    }
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        socket.request.user = verified;
        next();
    } catch (error) {
        next(new Error('Invalid token'));
    }
});

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sendMessage', async (message) => {
        const userId = socket.request.user.id;
        const newMessage = await createMessage(userId, message);
        io.emit('message', newMessage);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
