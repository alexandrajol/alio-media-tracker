const request = require('supertest');
const path = require('path');
const fs = require('fs');

process.env.ALIO_DATABASE_PATH = path.join(__dirname, '../../test.db');
if (fs.existsSync(process.env.ALIO_DATABASE_PATH)) {
  fs.unlinkSync(process.env.ALIO_DATABASE_PATH);
}

const app = require('../app'); 
const prisma = require('../config/prismaClient');

describe('Media Database Operations', () => {
  let authToken;

  beforeAll(async () => {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS User (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL,
        passwordHash TEXT,
        role TEXT NOT NULL DEFAULT 'USER',
        sessionTokenHash TEXT,
        sessionExpiresAt DATETIME,
        lastActiveAt DATETIME
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS Category (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS Media (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        genre TEXT,
        year INTEGER,
        rating INTEGER,
        review TEXT,
        posterUrl TEXT,
        director TEXT,
        duration TEXT,
        seasons INTEGER,
        author TEXT,
        pages INTEGER,
        userId INTEGER NOT NULL,
        categoryId INTEGER NOT NULL,
        CONSTRAINT Media_userId_fkey FOREIGN KEY (userId) REFERENCES User (id) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT Media_categoryId_fkey FOREIGN KEY (categoryId) REFERENCES Category (id) ON DELETE RESTRICT ON UPDATE CASCADE
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS UserMediaStatus (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        status TEXT NOT NULL,
        updatedAt DATETIME NOT NULL,
        userId INTEGER NOT NULL,
        mediaId INTEGER NOT NULL,
        CONSTRAINT UserMediaStatus_userId_fkey FOREIGN KEY (userId) REFERENCES User (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT UserMediaStatus_mediaId_fkey FOREIGN KEY (mediaId) REFERENCES Media (id) ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);

    await prisma.$executeRawUnsafe(`
      CREATE UNIQUE INDEX IF NOT EXISTS UserMediaStatus_userId_mediaId_key
      ON UserMediaStatus(userId, mediaId)
    `);

    await prisma.userMediaStatus.deleteMany();
    await prisma.media.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    
    // Seed required relations
    await prisma.category.create({ data: { id: 1, name: 'Movie' } });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  const api = () => ({
    get: (url) => request(app).get(url).set('Authorization', `Bearer ${authToken}`),
    post: (url) => request(app).post(url).set('Authorization', `Bearer ${authToken}`),
    patch: (url) => request(app).patch(url).set('Authorization', `Bearer ${authToken}`),
    put: (url) => request(app).put(url).set('Authorization', `Bearer ${authToken}`),
    delete: (url) => request(app).delete(url).set('Authorization', `Bearer ${authToken}`),
  });

  it('should REGISTER a user and return a token session', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@test.com',
      username: 'tester',
      password: 'secret123',
    });

    expect(res.statusCode).toEqual(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toMatchObject({
      email: 'test@test.com',
      username: 'tester',
      role: 'USER',
    });

    authToken = res.body.token;
  });

  it('should reject duplicate registration', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@test.com',
      username: 'tester',
      password: 'secret123',
    });

    expect(res.statusCode).toEqual(409);
  });

  it('should LOGIN a registered user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@test.com',
      password: 'secret123',
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.role).toBe('USER');

    authToken = res.body.token;
  });

  it('should reject invalid login credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'test@test.com',
      password: 'wrong-password',
    });

    expect(res.statusCode).toEqual(401);
  });

  it('should return current user and refresh session activity', async () => {
    const res = await api().get('/api/auth/me');

    expect(res.statusCode).toEqual(200);
    expect(res.body.user.email).toBe('test@test.com');
    expect(res.body.user.role).toBe('USER');
  });

  it('should reject media access without a token', async () => {
    const res = await request(app).get('/api/media');

    expect(res.statusCode).toEqual(401);
  });

  it('should CREATE a new media entry', async () => {
    const res = await api().post('/api/media').send({
      title: 'Inception',
      type: 'Movie',
      year: 2010,
      rating: 5,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.title).toBe('Inception');
  });

  it('should reject invalid media data', async () => {
    const res = await api().post('/api/media').send({
      title: '',
      type: 'Podcast',
      rating: 10,
    });

    expect(res.statusCode).toEqual(400);
    expect(res.body.errors).toBeDefined();
  });

  it('should READ all media entries', async () => {
    const res = await api().get('/api/media');

    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toMatchObject({
      title: 'Inception',
      type: 'Movie',
      userStatus: 'Unwatched',
      isCompleted: false,
    });
  });

  it('should READ a single media entry by id', async () => {
    const listRes = await api().get('/api/media');
    const createdItem = listRes.body.data[0];

    const res = await api().get(`/api/media/${createdItem.id}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.id).toBe(createdItem.id);
    expect(res.body.title).toBe('Inception');
    expect(res.body.type).toBe('Movie');
  });

  it('should return 404 when reading a missing media entry', async () => {
    const res = await api().get('/api/media/999999');

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('Media not found');
  });

  it('should UPDATE a media entry', async () => {
    const listRes = await api().get('/api/media?search=Inception');
    const item = listRes.body.data[0];

    const res = await api().put(`/api/media/${item.id}`).send({
      ...item,
      title: 'Inception Updated',
      type: 'Movie',
      rating: 4,
      review: 'Updated from the API test.',
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toBe('Inception Updated');
    expect(res.body.rating).toBe(4);
    expect(res.body.review).toBe('Updated from the API test.');
  });

  it('should DELETE a media entry', async () => {
    const createRes = await api().post('/api/media').send({
      title: 'Temporary Delete Test',
      type: 'Movie',
      year: 2024,
      rating: 3,
    });

    const deleteRes = await api().delete(`/api/media/${createRes.body.id}`);
    const getRes = await api().get(`/api/media/${createRes.body.id}`);

    expect(deleteRes.statusCode).toEqual(204);
    expect(getRes.statusCode).toEqual(404);
  });

  it('should filter media by type', async () => {
    await api().post('/api/media').send({
      title: 'Dune',
      type: 'Book',
      year: 1965,
      rating: 5,
      genre: 'Science Fiction',
    });

    const res = await api().get('/api/media?type=Book');

    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe('Dune');
    expect(res.body.data[0].type).toBe('Book');
  });

  it('should filter media by genre, year range, and rating range', async () => {
    await api().post('/api/media').send({
      title: 'The Matrix',
      type: 'Movie',
      year: 1999,
      rating: 4,
      genre: 'Science Fiction',
    });

    const res = await api().get('/api/media?genre=Science&yearFrom=1990&yearTo=2000&minRating=4');

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.map((item) => item.title)).toContain('The Matrix');
    expect(res.body.data.every((item) => item.genre.includes('Science'))).toBe(true);
    expect(res.body.data.every((item) => item.year >= 1990 && item.year <= 2000)).toBe(true);
    expect(res.body.data.every((item) => item.rating >= 4)).toBe(true);
  });

  it('should filter media by title search', async () => {
    const res = await api().get('/api/media?search=Matrix');

    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe('The Matrix');
  });

  it('should filter media by author or director', async () => {
    await api().post('/api/media').send({
      title: '1984',
      type: 'Book',
      year: 1949,
      rating: 5,
      genre: 'Dystopian',
      author: 'George Orwell',
    });

    const res = await api().get('/api/media?creator=George');

    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe('1984');
    expect(res.body.data[0].author).toBe('George Orwell');
  });

  it('should paginate filtered media', async () => {
    const res = await api().get('/api/media?type=Movie&page=1&limit=1');

    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].type).toBe('Movie');
  });

  it('should let the current user mark media as watched', async () => {
    const listRes = await api().get('/api/media?search=Matrix');
    const item = listRes.body.data[0];

    const res = await api().patch(`/api/media/${item.id}/status`).send({
      isCompleted: true,
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body.userStatus).toBe('Watched');
    expect(res.body.isCompleted).toBe(true);
  });

  it('should keep media status separate for each user', async () => {
    const registerRes = await request(app).post('/api/auth/register').send({
      email: 'second@test.com',
      username: 'second',
      password: 'secret123',
    });
    const secondToken = registerRes.body.token;

    const secondUserRes = await request(app)
      .get('/api/media?search=Matrix')
      .set('Authorization', `Bearer ${secondToken}`);

    expect(secondUserRes.statusCode).toEqual(200);
    expect(secondUserRes.body.data[0].userStatus).toBe('Unwatched');
    expect(secondUserRes.body.data[0].isCompleted).toBe(false);

    const firstUserRes = await api().get('/api/media?search=Matrix');
    expect(firstUserRes.body.data[0].userStatus).toBe('Watched');
  });

  it('should filter media by the current user status', async () => {
    const watchedRes = await api().get('/api/media?type=Movie&status=completed');
    const unwatchedRes = await api().get('/api/media?type=Movie&status=incomplete');

    expect(watchedRes.statusCode).toEqual(200);
    expect(watchedRes.body.data.map((item) => item.title)).toContain('The Matrix');
    expect(watchedRes.body.data.every((item) => item.isCompleted)).toBe(true);

    expect(unwatchedRes.statusCode).toEqual(200);
    expect(unwatchedRes.body.data.every((item) => !item.isCompleted)).toBe(true);
  });

  it('should fetch STATISTICS', async () => {
    const res = await api().get('/api/media/statistics');

    expect(res.statusCode).toEqual(200);
    expect(res.body.totalCount).toBeGreaterThan(0);
    expect(res.body.averageRating).toBeGreaterThan(0);
    expect(Array.isArray(res.body.ratingStats)).toBe(true);
    expect(Array.isArray(res.body.decadeStats)).toBe(true);
    expect(Array.isArray(res.body.genreStats)).toBe(true);
    expect(Array.isArray(res.body.statusStats)).toBe(true);
  });

  it('should fetch filtered STATISTICS by media type', async () => {
    const res = await api().get('/api/media/statistics?type=Book');

    expect(res.statusCode).toEqual(200);
    expect(res.body.totalCount).toBeGreaterThan(0);
    expect(res.body.statusStats.every((item) => ['Read', 'Unread'].includes(item.name))).toBe(true);
  });

  it('should expire a session after inactivity', async () => {
    await prisma.user.update({
      where: { email: 'test@test.com' },
      data: { sessionExpiresAt: new Date(Date.now() - 1000) }
    });

    const expiredRes = await api().get('/api/auth/me');
    expect(expiredRes.statusCode).toEqual(401);

    const loginRes = await request(app).post('/api/auth/login').send({
      email: 'test@test.com',
      password: 'secret123',
    });
    authToken = loginRes.body.token;
  });

  it('should LOGOUT and invalidate the token session', async () => {
    const logoutRes = await api().post('/api/auth/logout');
    const meRes = await api().get('/api/auth/me');

    expect(logoutRes.statusCode).toEqual(204);
    expect(meRes.statusCode).toEqual(401);
  });
});
