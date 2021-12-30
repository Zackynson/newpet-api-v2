import { DeletePetUseCase } from '@/data/useCases/Pets';
import { MemoryPetsRepository } from '@/infra/repositories/MemoryPetsRepository';
import { MemoryUsersRepository } from '@/infra/repositories';

describe('DeletePetUseCase', () => {
  test('Should throw an error if pet owner is not found', async () => {
    const petsRepository = new MemoryPetsRepository();
    const usersRepository = new MemoryUsersRepository();
    const deletePetUseCase = new DeletePetUseCase(petsRepository, usersRepository);

    await usersRepository.mockUsersList();
    await petsRepository.mockPetsList();

    const promise = deletePetUseCase.execute('invalid_pet_id', 'any_user_id');

    await expect(promise).rejects.toThrow('User not found');
  });

  test('Should throw an error if petId is not found', async () => {
    const petsRepository = new MemoryPetsRepository();
    const usersRepository = new MemoryUsersRepository();
    const deletePetUseCase = new DeletePetUseCase(petsRepository, usersRepository);

    await usersRepository.mockUsersList();
    await petsRepository.mockPetsList();

    usersRepository.users.find((u) => u.id === '1').pets.push('invalid_pet_id');

    const promise = deletePetUseCase.execute('invalid_pet_id', '1');

    await expect(promise).rejects.toThrow('Pet not found');
  });
});
