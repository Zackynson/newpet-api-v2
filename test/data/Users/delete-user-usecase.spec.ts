import { MemoryUsersRepository } from '@/infra/repositories';
import { BcryptEncryptionHelper } from '@/infra/helpers/BcryptEncryptionHelper';
import { DeleteUserUseCase } from '@/data/useCases/User';

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

  test('Should delete user if id is valid', async () => {
    const { sut, usersRepository } = makeSut();

    await usersRepository.mockUsersList();

    const userBeforeDeletion = usersRepository.users[0];
    await sut.execute(userBeforeDeletion?.id || '');

    // eslint-disable-next-line max-len
    const userAfterDeletion = usersRepository.users.find((foundUser) => foundUser?.id === userBeforeDeletion?.id);

    expect(userBeforeDeletion).not.toBe(undefined);
    expect(userAfterDeletion).toBe(undefined);
  });
});
