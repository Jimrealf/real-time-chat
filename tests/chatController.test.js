const request = require('supertest');
const app = require('../app');
const pool = require('../models/db');

let token; // To store the JWT token for authenticated requests
const uniqueUsername = `testuser_${Date.now()}`;

// Setup the database before tests
beforeAll(async () => {
    await pool.query('DELETE FROM messages;');
    await pool.query('DELETE FROM users;');

    try {
        const client = await pool.connect();
        client.release();
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }

    await pool.query(
        'CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), username VARCHAR(50), password VARCHAR(100));'
    );
    await pool.query(
        'CREATE TABLE IF NOT EXISTS messages (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), user_id UUID, content TEXT, created_at TIMESTAMP);'
    );

    // Register and log in a user to get a token
    await request(app).post('/api/auth/register').send({
        username: uniqueUsername,
        password: 'password123',
    });

    const res = await request(app).post('/api/auth/login').send({
        username: uniqueUsername,
        password: 'password123',
    });

    token = res.body.token;
});

// Clean up database after each test
afterEach(async () => {
    await pool.query('DELETE FROM messages;');
    await pool.query('DELETE FROM users;');
});

// Close database connection after all tests
afterAll(async () => {
    await pool.end();
});

describe('Chat Endpoints', () => {
    it('should post a new message', async () => {
        const res = await request(app)
            .post('/api/chat')
            .set('Authorization', `Bearer ${token}`)
            .send({
                content: 'Hello, world!',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('content', 'Hello, world!');
    });

    it('should get all messages', async () => {
        // Post a message first
        await request(app)
            .post('/api/chat')
            .set('Authorization', `Bearer ${token}`)
            .send({
                content: 'Hello, world!',
            });

        const res = await request(app)
            .get('/api/chat')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
    });
});
