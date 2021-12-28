import { UsersRepositoryMock } from '@test/infra/repositories';
import { User } from '@/domain/entities/User';
import { CreateUserUseCase } from '@/domain/useCases/CreateUserUseCase';
import { BcryptEncryptionHelper } from '@/infra/helpers/BcryptEncryptionHelper';
import { UpdateUserUseCase } from '@/domain/useCases/UpdateUserUseCase';

describe('UpdateUserUseCase', () => {
  const makeSut = () => {
    const usersRepository = new UsersRepositoryMock();
    const encriptionHelper = new BcryptEncryptionHelper();
    const createUserUseCase = new CreateUserUseCase(usersRepository, encriptionHelper);
    const sut = new UpdateUserUseCase(usersRepository, encriptionHelper);

    return {
      usersRepository, createUserUseCase, encriptionHelper, sut,
    };
  };

  test('Should update a user when passing valid params', async () => {
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

    expect(usersRepository.users[0].email).toBe('updated@email.com');
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
});
