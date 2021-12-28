import { UsersRepositoryMock } from '@test/infra/repositories';

const makeSut = () => {
  const sut = new UsersRepositoryMock();

  return { sut };
};

describe('FindUserByIdUseCase', () => {
  test('sut.findById should return an user if id exists', async () => {
    const { sut } = makeSut();
    const newUser = {
      id: 'new_user_id', email: 'new_email', password: 'new_password', name: 'new_user',
    };

    await sut.mockUsersList();
    await sut.insert(newUser);

    const foundUser = await sut.findById('new_user_id');

    expect(foundUser).toEqual(newUser);
  });

  test('sut.findById should return undefined user is not found', async () => {
    const { sut } = makeSut();
    const newUser = {
      id: 'new_user_id', email: 'new_email', password: 'new_password', name: 'new_user',
    };

    await sut.mockUsersList();
    const foundUser = await sut.findById(newUser.id);

    expect(foundUser).toEqual(undefined);
  });
});
