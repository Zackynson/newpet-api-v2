import { MemoryUsersRepository } from '@test/infra/repositories';

const makeSut = () => {
  const sut = new MemoryUsersRepository();
  const user = {
    id: 'any_id', name: 'any_name', email: 'any_email', password: 'any_password',
  };

  return { sut, user };
};

describe('MemoryUsersRepository', () => {
  test('should create a user', async () => {
    const { sut, user } = makeSut();

    await sut.insert(user);

    expect(sut.users).toEqual([user]);
  });

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

  test('sut.update should throw if user is not found', async () => {
    const { sut } = makeSut();

    await sut.mockUsersList();

    const promise = sut.update({
      id: 'invalid_id',
      data: {
        email: 'any_email',
        password: 'any_password',
        name: 'any_name',
      },
    });

    await expect(promise).rejects.toThrow();
  });

  test('sut.update should update an valid user', async () => {
    const { sut } = makeSut();

    await sut.mockUsersList();

    const userBeforeUpdate = sut.users.find((foundUser) => foundUser.id === '1');

    await sut.update({
      id: '1',
      data: {
        email: 'updated_email',
        password: 'updated_password',
        name: 'updated_name',
        avatarUrl: 'updated_url',
      },
    });

    const userAfterUpdate = sut.users.find((foundUser) => foundUser.id === '1');

    expect(userBeforeUpdate.id).toBe('1');
    expect(userBeforeUpdate.id).toBe(userAfterUpdate.id);
    expect(userBeforeUpdate.name).not.toBe(userAfterUpdate.name);
    expect(userBeforeUpdate.email).not.toBe(userAfterUpdate.email);
    expect(userBeforeUpdate.password).not.toBe(userAfterUpdate.password);
    expect(userBeforeUpdate.avatarUrl).not.toBe(userAfterUpdate.avatarUrl);
  });
});
