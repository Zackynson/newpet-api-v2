import { UpdatePetUseCase } from '@/data/useCases/Pets';
import { MemoryPetsRepository } from '@/infra/repositories/MemoryPetsRepository';
import { MemoryUsersRepository } from '@/infra/repositories';
import { UpdatePetParams } from '@/domain/repositories/PetsRepository';

describe('UpdatePetUseCase', () => {
  test('Should throw an error if pet is not found', async () => {
    const pet:UpdatePetParams = {
      name: 'any_name',
      age: 1,
      category: 'cat',
    };

    const petsRepository = new MemoryPetsRepository();
    const usersRepository = new MemoryUsersRepository();
    const updatePetUseCase = new UpdatePetUseCase(petsRepository, usersRepository);

    await usersRepository.mockUsersList();

    const promise = updatePetUseCase.execute({ petId: 'invalid_id', ownerId: '1', data: pet });

    await expect(promise).rejects.toThrow('Pet not found');
  });

  test('Should throw an error if pet owner is not found', async () => {
    const pet:UpdatePetParams = {
      name: 'any_name',
      age: 1,
      category: 'cat',
    };

    const petsRepository = new MemoryPetsRepository();
    const usersRepository = new MemoryUsersRepository();
    const updatePetUseCase = new UpdatePetUseCase(petsRepository, usersRepository);

    await usersRepository.mockUsersList();

    const promise = updatePetUseCase.execute({ petId: 'any_id', ownerId: 'invalid_id', data: pet });

    await expect(promise).rejects.toThrow('User not found');
  });

  test('Should throw an error if pet is not from expecified user', async () => {
    const pet:UpdatePetParams = {
      name: 'any_name',
      age: 1,
      category: 'cat',
    };

    const petsRepository = new MemoryPetsRepository();
    const usersRepository = new MemoryUsersRepository();
    const updatePetUseCase = new UpdatePetUseCase(petsRepository, usersRepository);

    await usersRepository.mockUsersList();

    const promise = updatePetUseCase.execute({ petId: 'any_id', ownerId: '1', data: pet });

    await expect(promise).rejects.toThrow('Pet not found on users account');
  });

  test('Should update a pet', async () => {
    const updateData:UpdatePetParams = {
      name: 'any_name',
      age: 1,
      category: 'cat',
      pictures: ['new_pic_1'],
    };

    const petsRepository = new MemoryPetsRepository();
    const usersRepository = new MemoryUsersRepository();
    const updatePetUseCase = new UpdatePetUseCase(petsRepository, usersRepository);

    await usersRepository.mockUsersList();
    await petsRepository.mockPetsList();

    const petBeforeUpdate = await petsRepository.findByid('1');

    const updatedPet = await updatePetUseCase.execute({ petId: '1', ownerId: '1', data: updateData });

    expect(updatedPet).toEqual({ ...petBeforeUpdate, ...updateData });
  });
});
