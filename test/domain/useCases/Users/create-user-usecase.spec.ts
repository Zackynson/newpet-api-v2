import { UsersRepositoryMock } from '@test/infra';
import { User } from '@/domain/entities/User';
import { CreateUserUseCase } from '@/domain/useCases/CreateUserUseCase';

describe('CreateUserUseCase', () => {
  const makeSut = () => {
    const usersRepository = new UsersRepositoryMock();
    const sut = new CreateUserUseCase(usersRepository);

    return { usersRepository, sut };
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

    expect(usersRepository.users[0]).toEqual(user);
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
});
