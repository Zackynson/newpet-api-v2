import { MongoHelper as sut } from '@/infra/db/mongodb/helpers/MongoHelper';

describe('MongoHelper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await sut.disconnect();
  });

  test('Should reconnect on getCollection if mongo is down', async () => {
    let usersCollection = await sut.getCollection('users');
    expect(usersCollection).toBeTruthy();

    await sut.disconnect();

    usersCollection = await sut.getCollection('users');
    expect(usersCollection).toBeTruthy();
  });
});
