import request from 'supertest';
import app from '@/main/config/app';
import { MongoHelper } from '@/infra/db/mongodb/helpers/MongoHelper';

describe('Register Pet Route', () => {
  beforeAll(async () => { await MongoHelper.connect(process.env.MONGO_URL); });
  afterAll(async () => { await MongoHelper.disconnect(); });

  beforeEach(async () => {
    const usersCollection = await MongoHelper.getCollection('users');
    const petsCollection = await MongoHelper.getCollection('pets');
    await usersCollection.deleteMany({});
    await petsCollection.deleteMany({});
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

    const response = await request(app).post('/signin').send({
      email: 'test@email.com',
      password: 'testeNewPet$123',
    });

    const token = response.body.data.access_token;

    await request(app).post('/pets').set({ 'x-access-token': token }).send({
      name: 'any_pet',
      category: 'cat',
      age: 1,
    })
      .expect(200);
  });
});
