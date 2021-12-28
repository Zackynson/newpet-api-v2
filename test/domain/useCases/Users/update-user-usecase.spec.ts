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
      email: 'updated@email.com',
    });

    expect(usersRepository.users[0].email).toBe('updated@email.com');
  });
});
