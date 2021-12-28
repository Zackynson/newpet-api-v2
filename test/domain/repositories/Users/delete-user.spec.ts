import { UsersRepositoryMock } from '@test/infra/repositories';

const makeSut = () => {
  const sut = new UsersRepositoryMock();

  return { sut };
};

describe('DeleteUserUseCase', () => {
  test('sut.delete should throw if user is not found', async () => {
    const { sut } = makeSut();

    await sut.mockUsersList();
    const promise = sut.delete('invalid_id');

    await expect(promise).rejects.toThrow();
  });

  test('sut.delete should delete user if id exists', async () => {
    const { sut } = makeSut();

    await sut.mockUsersList();

    const userToBeDeleted = sut.users.find((u) => u.id === '1');
    await sut.delete('1');
    const userAfterDeletion = sut.users.find((u) => u.id === '1');

    expect(userToBeDeleted?.id).toBe('1');
    expect(userAfterDeletion?.id).toBe(undefined);
  });
});
