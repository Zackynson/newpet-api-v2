import { MemoryUsersRepository } from '@/infra/repositories';
import { User } from '@/domain/entities/User';
import { CreateUserUseCase } from '@/data/useCases/User';
import { BcryptEncryptionHelper } from '@/infra/helpers/BcryptEncryptionHelper';

describe('CreateUserUseCase', () => {
  const makeSut = () => {
    const usersRepository = new MemoryUsersRepository();
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
    const { sut, usersRepository } = makeSut();

    const user: User = {
      email: 'same@email.com',
      name: 'any_name',
      avatarUrl: 'any_url',
      password: '12345678',
    };

    await sut.execute(user);
    const insertedUser = await usersRepository.findByEmail(user.email);

    expect(insertedUser?.email).toBe(user.email);
    expect(insertedUser?.password).not.toBe(user?.password);
  });

  test('User password hash should be comparable', async () => {
    const { sut, usersRepository, encriptionHelper } = makeSut();

    const user: User = {
      email: 'same@email.com',
      name: 'any_name',
      avatarUrl: 'any_url',
      password: '12345678',
    };

    await sut.execute(user);
    const insertedUser = await usersRepository.findByEmail(user.email);
    const passwordMatch = await encriptionHelper.compare(user.password, insertedUser?.password || '');

    expect(insertedUser?.email).toBe(user.email);
    expect(insertedUser?.password).not.toBe(user?.password);
    expect(passwordMatch).toBe(true);
  });
});
