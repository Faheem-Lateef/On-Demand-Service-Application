import request from 'supertest';
import { app } from '../index';

describe('Auth API Endpoints', () => {
    describe('POST /api/auth/register', () => {
        it('should return 400 if required fields are missing', async () => {
            const res = await request(app).post('/api/auth/register').send({
                email: 'test@example.com',
                // missing password and name
            });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toMatch(/Please provide name, email, and password/i);
        });
    });
});
