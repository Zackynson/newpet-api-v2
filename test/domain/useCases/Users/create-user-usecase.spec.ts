import { UsersRepositoryMock } from '@test/infra/repositories';
import { User } from '@/domain/entities/User';
import { CreateUserUseCase } from '@/domain/useCases/CreateUserUseCase';
import { BcryptEncryptionHelper } from '@/infra/helpers/BcryptEncryptionHelper';

describe('CreateUserUseCase', () => {
  const makeSut = () => {
    const usersRepository = new UsersRepositoryMock();
    const encriptionHelper = new BcryptEncryptionHelper();
    const sut = new CreateUserUseCase(usersRepository, encriptionHelper);

    return { usersRepository, encriptionHelper, sut };
  };

  test('Should create a user when passing valid params', async () => {
    const { usersRepository, sut } = makeSut();

    const user: User = {
      email: 'any_email@email.com',
      name: 'any_name',
      avatarUrl: 'any_url',
      password: 'any_password',
    };

    await sut.execute(user);

    expect(usersRepository.users[0].email).toBe(user.email);
  });

  test('Should not create a user when email already registered', async () => {
    const { sut } = makeSut();

    const user: User = {
      email: 'same@email.com',
      name: 'any_name',
      avatarUrl: 'any_url',
      password: 'any_password',
    };

    const user2: User = {
      email: 'same@email.com',
      name: 'another_name',
      avatarUrl: 'another_url',
      password: 'another_password',
    };

    await sut.execute(user);

    await expect(sut.execute(user2)).rejects.toThrow();
  });

  // eslint-disable-next-line no-undef
  test('Should not create a user when password length is less than 8 chars', async () => {
    const { sut } = makeSut();

    const user: User = {
      email: 'same@email.com',
      name: 'any_name',
      avatarUrl: 'any_url',
      password: '1234567',
    };

    await expect(sut.execute(user)).rejects.toThrow();
  });

  test('User password should be encrypted before inserted', async () => {
    const { sut, encriptionHelper, usersRepository } = makeSut();

    const user: User = {
      email: 'same@email.com',
      name: 'any_name',
      avatarUrl: 'any_url',
      password: '12345678',
    };

    await sut.execute(user);

    const insertedUser = await usersRepository.findByEmail(user.email);

    expect(user).not.toBe(insertedUser?.password);
  });
});
