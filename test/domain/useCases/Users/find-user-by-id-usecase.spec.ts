import { UsersRepositoryMock } from '@test/infra/repositories';
import { BcryptEncryptionHelper } from '@/infra/helpers/BcryptEncryptionHelper';
import { FindUserByIdUseCase } from '@/data/useCases';

describe('FindUserByIdUseCase', () => {
  const makeSut = () => {
    const usersRepository = new UsersRepositoryMock();
    const encriptionHelper = new BcryptEncryptionHelper();
    const sut = new FindUserByIdUseCase(usersRepository);

    return {
      usersRepository,
      encriptionHelper,
      sut,
    };
  };

  test('Should throw an error if an invalid id is informed', async () => {
    const { sut } = makeSut();

    const promise = sut.execute('invalid_id');

    await expect(promise).rejects.toThrow('User not found');
  });
});
