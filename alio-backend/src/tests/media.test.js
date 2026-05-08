// tests/media.test.js
const request = require('supertest');
const app = require('../src/app');

describe('Media API Endpoints', () => {
    it('should paginate items', async () => {
        const res = await request(app).get('/api/media?page=1&limit=1');
        expect(res.statusCode).toEqual(200);
        expect(res.body.data.length).toBeLessThanOrEqual(1);
    });

    it('should create a new item', async () => {
        const res = await request(app)
            .post('/api/media')
            .send({ title: "Avatar", type: "movie", rating: 4 });
        expect(res.statusCode).toEqual(201);
        expect(res.body.title).toEqual("Avatar");
    });

    it('should fail validation on invalid data', async () => {
        const res = await request(app)
            .post('/api/media')
            .send({ title: "", type: "invalid_type" }); // Bad data
        expect(res.statusCode).toEqual(400);
        expect(res.body.errors).toBeDefined();
    });
});