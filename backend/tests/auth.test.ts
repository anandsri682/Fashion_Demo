import request from 'supertest';
import app from '../src/app';
import { User } from '../src/models/User';

describe('Auth', () => {
  const validUser = {
    firstName: 'Anand',
    lastName: 'Raju',
    email: 'anand@example.com',
    phone: '9876543210',
    password: 'password123',
  };

  it('registers a new user and returns a token', async () => {
    const res = await request(app).post('/api/auth/register').send(validUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(validUser.email);
    expect(res.body.user.password).toBeUndefined();
  });

  it('rejects duplicate email registration', async () => {
    await request(app).post('/api/auth/register').send(validUser);
    const res = await request(app).post('/api/auth/register').send(validUser);
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('logs in with correct credentials', async () => {
    await request(app).post('/api/auth/register').send(validUser);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: validUser.password });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('rejects login with invalid password', async () => {
    await request(app).post('/api/auth/register').send(validUser);
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: validUser.email, password: 'wrongpassword' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('never stores the password in plain text', async () => {
    await request(app).post('/api/auth/register').send(validUser);
    const user = await User.findOne({ email: validUser.email }).select('+password');
    expect(user!.password).not.toBe(validUser.password);
  });
});
