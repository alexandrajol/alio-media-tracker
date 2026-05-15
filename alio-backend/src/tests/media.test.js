const request = require('supertest');
const app = require('../app'); // Assuming this exports your Express app without starting the server
const prisma = require('../config/prismaClient');

describe('Media Database Operations', () => {
  // Clear the database before tests run
  beforeAll(async () => {
    await prisma.media.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    
    // Seed required relations
    await prisma.user.create({ data: { id: 1, email: 'test@test.com', username: 'tester' } });
    await prisma.category.create({ data: { id: 1, name: 'Movie' } });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should CREATE a new media entry', async () => {
    const res = await request(app).post('/api/media').send({
      title: 'Inception',
      status: 'Completed',
      rating: 5,
      userId: 1,
      categoryId: 1
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.title).toBe('Inception');
  });

  it('should fetch STATISTICS', async () => {
    const res = await request(app).get('/api/media/stats/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body.stats._count.id).toBeGreaterThan(0);
  });
});



// // tests/media.test.js
// const request = require('supertest');
// const app = require('../src/app');

// describe('Media API Endpoints', () => {
//     it('should paginate items', async () => {
//         const res = await request(app).get('/api/media?page=1&limit=1');
//         expect(res.statusCode).toEqual(200);
//         expect(res.body.data.length).toBeLessThanOrEqual(1);
//     });

//     it('should create a new item', async () => {
//         const res = await request(app)
//             .post('/api/media')
//             .send({ title: "Avatar", type: "movie", rating: 4 });
//         expect(res.statusCode).toEqual(201);
//         expect(res.body.title).toEqual("Avatar");
//     });

//     it('should fail validation on invalid data', async () => {
//         const res = await request(app)
//             .post('/api/media')
//             .send({ title: "", type: "invalid_type" }); // Bad data
//         expect(res.statusCode).toEqual(400);
//         expect(res.body.errors).toBeDefined();
//     });
// });