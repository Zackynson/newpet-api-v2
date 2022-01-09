import request from 'supertest';
import app from '@/main/config/app';

describe('Content-Type Middleware', () => {
  test('Should return JSON as default response content-type', async () => {
    app.get('/default_content_type_test', (req, res) => res.send(''));

    await request(app)
      .get('/default_content_type_test')
      .expect('content-type', /json/);
  });
});
