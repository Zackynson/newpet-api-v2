import { MemoryUsersRepository } from '@test/infra/repositories';
import { BcryptEncryptionHelper } from '@/infra/helpers/BcryptEncryptionHelper';
import { DeleteUserUseCase } from '@/data/useCases';

describe('DeleteUserUseCase', () => {
  const makeSut = () => {
    const usersRepository = new MemoryUsersRepository();
    const encriptionHelper = new BcryptEncryptionHelper();
    const sut = new DeleteUserUseCase(usersRepository);

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
