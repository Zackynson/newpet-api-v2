import { MemoryUsersRepository } from '@test/infra/repositories';

const makeSut = () => {
  const sut = new MemoryUsersRepository();

  return { sut };
};

describe('UpdateUserUseCase', () => {
  test('sut.update should throw if user is not found', async () => {
    const { sut } = makeSut();

    await sut.mockUsersList();

    const promise = sut.update({
      id: 'invalid_id',
      user: {
        email: 'any_email', password: 'any_password', name: 'any_name',
      },
    });

    await expect(promise).rejects.toThrow();
  });
});
