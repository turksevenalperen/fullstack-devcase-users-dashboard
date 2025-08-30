import request from 'supertest';
import app from '../src/app';
import sequelize from '../src/config/database';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Users', () => {
  it('should create a parent and child user and fetch nested', async () => {
    const parent = await request(app).post('/api/users').send({
      firstName: 'Parent',
      lastName: 'One',
      email: 'parent@example.com',
      password: 'password123',
    });
    expect(parent.status).toBe(201);
    const parentId = parent.body.id || parent.body.user?.id || parent.body.data?.id;

    const child = await request(app).post('/api/users').send({
      firstName: 'Child',
      lastName: 'One',
      email: 'child@example.com',
      password: 'password123',
      parentId,
    });
    expect(child.status).toBe(201);

    const list = await request(app).get('/api/users');
    expect(list.status).toBe(200);

    const children = await request(app).get('/api/users').query({ parentId });
    expect(children.status).toBe(200);
    expect(Array.isArray(children.body.data)).toBe(true);
  });
});
