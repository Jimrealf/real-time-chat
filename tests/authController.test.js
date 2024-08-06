const request = require('supertest');
const app = require('../app');
const pool = require('../models/db');

// Run migrations or setup test DB before all tests
beforeAll(async () => {
    await pool.query('DELETE FROM messages;');
    await pool.query('DELETE FROM users;');

    try {
        const client = await pool.connect();
        console.log('Successfully connected to the database');
        client.release();
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }

    await pool.query(
        'CREATE TABLE IF NOT EXISTS users (id UUID PRIMARY KEY DEFAULT uuid_generate_v4(), username VARCHAR(50), password VARCHAR(100));'
    );
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

describe('Authentication Endpoints', () => {
    it('should register a new user', async () => {
        const res = await request(app).post('/api/auth/register').send({
            username: 'testuser',
            password: 'password123',
        });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('username', 'testuser');
    });

    it('should log in an existing user', async () => {
        // First, register the user
        await request(app).post('/api/auth/register').send({
            username: 'testuser',
            password: 'password123',
        });

        // Then, try logging in
        const res = await request(app).post('/api/auth/login').send({
            username: 'testuser',
            password: 'password123',
        });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should fail login with wrong credentials', async () => {
        // First, register the user
        await request(app).post('/api/auth/register').send({
            username: 'testuser',
            password: 'password123',
        });

        // Then, try logging in with incorrect password
        const res = await request(app).post('/api/auth/login').send({
            username: 'testuser',
            password: 'wrongpassword',
        });
        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message', 'Wrong username/password');
    });
});
