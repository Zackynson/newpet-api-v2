import { MemoryUsersRepository } from '@test/infra/repositories';
import { User } from '@/domain/entities/User';
import { CreateUserUseCase, UpdateUserUseCase } from '@/data/useCases';
import { BcryptEncryptionHelper } from '@/infra/helpers/BcryptEncryptionHelper';

describe('UpdateUserUseCase', () => {
  const makeSut = () => {
    const usersRepository = new MemoryUsersRepository();
    const encriptionHelper = new BcryptEncryptionHelper();
    const createUserUseCase = new CreateUserUseCase(usersRepository, encriptionHelper);
    const sut = new UpdateUserUseCase(usersRepository, encriptionHelper);

    return {
      usersRepository, createUserUseCase, encriptionHelper, sut,
    };
  };

  test('Should update a user when an invalid id is informed', async () => {
    const { createUserUseCase, sut } = makeSut();

    const user: User = {
      email: 'any_email@email.com',
      name: 'any_name',
      avatarUrl: 'any_url',
      password: 'any_password',
    };

    await createUserUseCase.execute(user);

    const promise = sut.execute('invalid_id', {
      name: 'updated',
      email: 'updated@email.com',
      avatarUrl: 'updated_url',
    });

    await expect(promise).rejects.toThrow('User not found');
  });

  test('Should throw an error when trying to update password without oldPassword', async () => {
    const { createUserUseCase, sut } = makeSut();

    const user: User = {
      email: 'any_email@email.com',
      name: 'any_name',
      avatarUrl: 'any_url',
      password: 'any_password',
    };

    await createUserUseCase.execute(user);

    const promise = sut.execute('1', {
      password: 'newPassword123',
      confirmPassword: 'newPassword123',
    });

    await expect(promise).rejects.toThrow('oldPassword not informed');
  });

  test('Should throw an error when trying to update password using an invalid oldPassword', async () => {
    const { createUserUseCase, sut } = makeSut();

    const user: User = {
      email: 'any_email@email.com',
      name: 'any_name',
      avatarUrl: 'any_url',
      password: 'any_password',
    };

    await createUserUseCase.execute(user);

    const promise = sut.execute('1', {
      oldPassword: 'invalid_password',
      password: 'newPassword123',
      confirmPassword: 'newPassword123',
    });

    await expect(promise).rejects.toThrow('oldPassword is invalid');
  });

  test('Should throw an error when trying to update password with different confirmPassword', async () => {
    const { createUserUseCase, sut } = makeSut();

    const user: User = {
      email: 'any_email@email.com',
      name: 'any_name',
      avatarUrl: 'any_url',
      password: 'any_password',
    };

    await createUserUseCase.execute(user);

    const promise = sut.execute('1', {
      oldPassword: 'any_password',
      password: 'newPassword123',
      confirmPassword: 'different_password',
    });

    await expect(promise).rejects.toThrow('password and confirmPassword does not match');
  });

  test('Should throw an error when trying to update password without confirmPassword', async () => {
    const { createUserUseCase, sut } = makeSut();

    const user: User = {
      email: 'any_email@email.com',
      name: 'any_name',
      avatarUrl: 'any_url',
      password: 'any_password',
    };

    await createUserUseCase.execute(user);

    const promise = sut.execute('1', {
      oldPassword: 'any_password',
      password: 'newPassword123',
    });

    await expect(promise).rejects.toThrow('confirmPassword not informed');
  });

  test('Should throw an error when trying to update password with less than 8 chars', async () => {
    const { createUserUseCase, sut } = makeSut();

    const user: User = {
      email: 'any_email@email.com',
      name: 'any_name',
      avatarUrl: 'any_url',
      password: 'any_password',
    };

    await createUserUseCase.execute(user);

    const promise = sut.execute('1', {
      oldPassword: 'any_password',
      password: '1234567',
      confirmPassword: '1234567',
    });

    await expect(promise).rejects.toThrow('password should have at least 8 chars');
  });

  test('Should update a users name, email and avatarUrl', async () => {
    const { usersRepository, createUserUseCase, sut } = makeSut();

    const user: User = {
      email: 'any_email@email.com',
      name: 'any_name',
      avatarUrl: 'any_url',
      password: 'any_password',
    };

    await createUserUseCase.execute(user);

    await sut.execute('1', {
      name: 'updated',
      email: 'updated@email.com',
      avatarUrl: 'updated_url',
    });

    expect(usersRepository.users[0].name).toBe('updated');
    expect(usersRepository.users[0].email).toBe('updated@email.com');
    expect(usersRepository.users[0].avatarUrl).toBe('updated_url');
  });

  test('Should update password', async () => {
    const {
      createUserUseCase, encriptionHelper, usersRepository, sut,
    } = makeSut();

    const user: User = {
      email: 'any_email@email.com',
      name: 'any_name',
      avatarUrl: 'any_url',
      password: 'any_password',
    };

    await createUserUseCase.execute(user);

    const userBeforeUpdate = await usersRepository.findById('1');

    await sut.execute('1', {
      oldPassword: 'any_password',
      password: 'newPassword',
      confirmPassword: 'newPassword',
    });

    const userAfterUpdate = await usersRepository.findById('1');
    const newPasswordIsValid = await encriptionHelper.compare('newPassword', userAfterUpdate?.password || '');

    expect(userBeforeUpdate?.password).not.toEqual(userAfterUpdate?.password);
    expect(newPasswordIsValid).toBe(true);
  });
});
