import { MemoryUsersRepository } from '@test/infra/repositories';

const makeSut = () => {
  const sut = new MemoryUsersRepository();
  const user = {
    id: 'any_id', name: 'any_name', email: 'any_email', password: 'any_password',
  };

  return { sut, user };
};

describe('Create user', () => {
  test('should create a user', async () => {
    const { sut, user } = makeSut();

    await sut.insert(user);

    expect(sut.users).toEqual([user]);
  });
});
