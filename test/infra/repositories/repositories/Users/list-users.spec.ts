import { MemoryUsersRepository } from '@test/infra/repositories';

const makeSut = () => {
  const sut = new MemoryUsersRepository();

  return { sut };
};

describe('ListUserUseCase', () => {
  test('Should bring an users list when list method is called', async () => {
    const { sut } = makeSut();

    await sut.mockUsersList();
    const users = await sut.list();

    expect(users).toEqual(sut.users);
  });

  test('sut.list should not throw if list is empty', async () => {
    const { sut } = makeSut();

    const usersList = await sut.list();

    expect(usersList.length).toBe(0);
  });
});
