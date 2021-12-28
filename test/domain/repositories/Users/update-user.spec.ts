import { UsersRepositoryMock } from '@test/infra/repositories';

const makeSut = () => {
  const sut = new UsersRepositoryMock();
  const user = {
    id: 'any_id', name: 'any_name', email: 'any_email', password: 'any_password',
  };

  const mockUsersList = async () => {
    await sut.insert({
      id: '1', email: 'email_1', password: 'new_password', name: 'new_user_1',
    });
    await sut.insert({
      id: '2', email: 'email_2', password: 'new_password', name: 'new_user_2',
    });
    await sut.insert({
      id: '3', email: 'email_3', password: 'new_password', name: 'new_user_3',
    });
  };

  return { sut, user, mockUsersList };
};

describe('UpdateUserUseCase', () => {
  test('sut.update should throw if user is not found', async () => {
    const { sut, mockUsersList } = makeSut();

    await mockUsersList();
    const promise = sut.update({
      id: 'invalid_id',
      user: {
        email: 'any_email', password: 'any_password', name: 'any_name',
      },
    });

    await expect(promise).rejects.toThrow();
  });
});
