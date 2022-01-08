import { MongoUsersRepository } from '@/infra/db/mongodb/Users/MongoUsersRepository';

import { MongoHelper } from '@/infra/db/mongodb/helpers/MongoHelper';

const mongoHelper = new MongoHelper();

describe('MongoUsersRepository', () => {
  beforeAll(async () => { await mongoHelper.connect(process.env.MONGO_URL); });
  afterAll(async () => { await mongoHelper.disconnect(); });

  test('Should create an user on success', async () => {
    const sut = new MongoUsersRepository(mongoHelper);
    const user = {
      name: 'any_name',
      email: 'any_email@email.com',
      password: 'any_password',
      avatarUrl: 'any_url.jpeg',
      pets: [],
    };

    const createdUser = await sut.insert(user);

    expect(createdUser).toBeTruthy();
    expect(createdUser.id).toBeTruthy();
    expect(createdUser.name).toBe('any_name');
    expect(createdUser.email).toBe('any_email@email.com');
    expect(createdUser.password).toBe('any_password');
    expect(createdUser.avatarUrl).toBe('any_url.jpeg');
    expect(createdUser.pets).toEqual([]);
  });
});
