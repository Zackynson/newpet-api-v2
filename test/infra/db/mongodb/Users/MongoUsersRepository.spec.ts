import { MongoUsersRepository } from '@/infra/db/mongodb/Users/MongoUsersRepository';

import { MongoHelper } from '@/infra/db/mongodb/helpers/MongoHelper';

describe('MongoUsersRepository', () => {
  beforeAll(async () => { await MongoHelper.connect(process.env.MONGO_URL); });
  afterAll(async () => { await MongoHelper.disconnect(); });

  beforeEach(async () => {
    const collection = await MongoHelper.getCollection('users');
    await collection.deleteMany({});
  });

  test('Should create an user on success', async () => {
    const sut = new MongoUsersRepository();
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

  test('Should add a pet id to the users pets array', async () => {
    const sut = new MongoUsersRepository();
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
    expect(createdUser.pets).toEqual([]);

    await sut.addPet({
      userId: createdUser.id,
      petId: 'any_pet_id',
    });

    const updatedUser = await sut.findByEmail('any_email@email.com');

    expect(updatedUser?.pets).toEqual(['any_pet_id']);
  });
});
