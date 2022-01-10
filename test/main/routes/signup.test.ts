import request from 'supertest';
import app from '@/main/config/app';
import { MongoHelper } from '@/infra/db/mongodb/helpers/MongoHelper';

describe('SignUp Route', () => {
  beforeAll(async () => { await MongoHelper.connect(process.env.MONGO_URL); });
  afterAll(async () => { await MongoHelper.disconnect(); });

  beforeEach(async () => {
    const collection = await MongoHelper.getCollection('users');
    await collection.deleteMany({});
  });

  test('Should return 200', async () => {
    await request(app).post('/signup').send({
      name: 'test',
      email: 'test@email.com',
      password: 'testeNewPet$123',
      confirmPassword: 'testeNewPet$123',
      avatarUrl: 'test.png',

    })
      .expect(200);
  });
});
