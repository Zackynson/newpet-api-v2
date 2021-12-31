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

  test('Should throw an error if pet is not found', async () => {
    const petsRepository = new MemoryPetsRepository();
    const usersRepository = new MemoryUsersRepository();
    const deletePetUseCase = new DeletePetUseCase(petsRepository, usersRepository);

    await usersRepository.mockUsersList();
    await petsRepository.mockPetsList();

    usersRepository.users.find((u) => u.id === '1').pets.push('invalid_pet_id');

    const promise = deletePetUseCase.execute('invalid_pet_id', '1');

    await expect(promise).rejects.toThrow('Pet not found');
  });

  test('Should throw an error if petId is not found on usersAccount', async () => {
    const petsRepository = new MemoryPetsRepository();
    const usersRepository = new MemoryUsersRepository();
    const deletePetUseCase = new DeletePetUseCase(petsRepository, usersRepository);

    await usersRepository.mockUsersList();
    await petsRepository.mockPetsList();

    petsRepository.pets.push({
      id: 'not_on_users_account',
      name: 'any_name',
      category: 'cat',
      age: 1,
      ownerId: 'any',
    });

    const promise = deletePetUseCase.execute('not_on_users_account', '1');

    await expect(promise).rejects.toThrow('Pet not found on users account');
  });

  test('Should delete a Pet and remove id from user petsArray', async () => {
    const petsRepository = new MemoryPetsRepository();
    const usersRepository = new MemoryUsersRepository();
    const deletePetUseCase = new DeletePetUseCase(petsRepository, usersRepository);

    await usersRepository.mockUsersList();
    await petsRepository.mockPetsList();

    const petToBeDeleted = {
      id: 'to_be_deleted',
      name: 'any_name',
      category: 'cat',
      age: 1,
      ownerId: 'any',
    };

    petsRepository.pets.push({
      id: 'to_be_deleted',
      name: 'any_name',
      category: 'cat',
      age: 1,
      ownerId: 'any',
    });

    usersRepository.users.find((u) => u.id === '1')?.pets?.push('to_be_deleted');

    const petBeforeDelete = await petsRepository.findByid('to_be_deleted');
    const { pets: usersPetArrayBeforeDelete } = await usersRepository.findById('1');
    expect(petBeforeDelete).toEqual(petToBeDeleted);
    expect(usersPetArrayBeforeDelete).toContain(petToBeDeleted.id);

    await deletePetUseCase.execute('to_be_deleted', '1');

    const petAfterDelete = await petsRepository.findByid('to_be_deleted');
    const { pets: usersPetArrayAfterDelete } = await usersRepository.findById('1');

    expect(petAfterDelete).toBe(undefined);
    expect(usersPetArrayAfterDelete).not.toContain(petToBeDeleted.id);
  });
});
