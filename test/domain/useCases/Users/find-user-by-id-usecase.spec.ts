import { UsersRepositoryMock } from '@test/infra/repositories';
import { User } from '@/domain/entities/User';
import { CreateUserUseCase, FindUserByIdUseCase } from '@/data/useCases';
import { BcryptEncryptionHelper } from '@/infra/helpers/BcryptEncryptionHelper';

describe('FindUserByIdUseCase', () => {
  const makeSut = () => {
    const usersRepository = new UsersRepositoryMock();
    const encriptionHelper = new BcryptEncryptionHelper();
    const createUserUseCase = new CreateUserUseCase(usersRepository, encriptionHelper);
    const sut = new FindUserByIdUseCase(usersRepository);

    return {
      usersRepository, createUserUseCase, encriptionHelper, sut,
    };
  };

  test('Should throw an error if an invalid id is informed', async () => {
    const { createUserUseCase, sut } = makeSut();

    const user: User = {
      email: 'any_email@email.com',
      name: 'any_name',
      avatarUrl: 'any_url',
      password: 'any_password',
    };

    await createUserUseCase.execute(user);

    const promise = sut.execute('invalid_id');

    await expect(promise).rejects.toThrow('User not found');
  });
});
