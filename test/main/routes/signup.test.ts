import request from 'supertest';
import app from '@/main/config/app';

describe('SignUp Route', () => {
  test('Should return 200', async () => {
    await request(app).post('/signup').send()
      .expect(200);
  });
});
