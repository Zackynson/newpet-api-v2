import request from 'supertest';
import app from '@/main/config/app';

describe('Content-Type Middleware', () => {
  test('Should return JSON as default response content-type', async () => {
    app.get('/default_content_type_test', (req, res) => res.send(''));

    await request(app)
      .get('/default_content_type_test')
      .expect('content-type', /json/);
  });

  test('Should return XML as response content-type if forced', async () => {
    app.get('/force_content_type_test', (req, res) => { res.type('xml'); return res.send(''); });

    await request(app)
      .get('/force_content_type_test')
      .expect('content-type', /xml/);
  });
});
