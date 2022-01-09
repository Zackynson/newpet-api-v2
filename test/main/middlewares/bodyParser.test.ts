import request from 'supertest';
import app from '@/main/config/app';

describe('BodyParser Middleware', () => {
  test('Should parse request body as JSON', async () => {
    app.post('/body_parser_test', (req, res) => res.send(req.body));

    await request(app).post('/body_parser_test').send({
      test: 'isWorking',
    }).expect({ test: 'isWorking' });
  });
});
