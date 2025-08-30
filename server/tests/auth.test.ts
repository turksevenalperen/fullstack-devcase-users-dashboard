import request from 'supertest';
import app from '../src/app';
import sequelize from '../src/config/database';
import User from '../src/models/User';
import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('Auth', () => {
  it('should register and login a user', async () => {
    const userPayload = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
    };

    const reg = await request(app).post('/api/auth/register').send(userPayload);
    expect(reg.status).toBe(201);
    expect(reg.body.user).toBeDefined();
    expect(reg.body.user.email).toBe(userPayload.email);

    const login = await request(app).post('/api/auth/login').send({ email: userPayload.email, password: userPayload.password });
    expect(login.status).toBe(200);
    expect(login.body.token).toBeDefined();
    expect(login.body.user).toBeDefined();
  });
});
