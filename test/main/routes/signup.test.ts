import request from 'supertest';
import app from '@/main/config/app';
import { MongoHelper } from '@/infra/db/mongodb/helpers/MongoHelper';

const mongoHelper = new MongoHelper();

describe('SignUp Route', () => {
  beforeAll(async () => { await mongoHelper.connect(process.env.MONGO_URL); });
  afterAll(async () => { await mongoHelper.disconnect(); });

  beforeEach(async () => {
    const collection = await mongoHelper.getCollection('users');
    await collection.deleteMany({});
  });

  test('Should return 200', async () => {
    await request(app).post('/signup').send()
      .expect(200);
  });
});
