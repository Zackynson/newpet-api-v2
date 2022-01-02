import { UpdatePetUseCase } from '@/data/useCases/Pets';
import { MemoryPetsRepository, MemoryUsersRepository } from '@/infra/repositories';
import { UpdatePetParams } from '@/domain/repositories/PetsRepository';

describe('UpdatePetUseCase', () => {
  const makeSut = () => {
    const petsRepository = new MemoryPetsRepository();
    const usersRepository = new MemoryUsersRepository();
    const sut = new UpdatePetUseCase(petsRepository, usersRepository);

    return { sut, petsRepository, usersRepository };
  };

  test('Should throw an error if pet is not found', async () => {
    const { sut, usersRepository } = makeSut();

    const pet:UpdatePetParams = {
      name: 'any_name',
      age: 1,
      category: 'cat',
    };

    await usersRepository.mockUsersList();

    const promise = sut.execute({ petId: 'invalid_id', ownerId: '1', data: pet });

    await expect(promise).rejects.toThrow('Pet not found');
  });

  test('Should throw an error if pet owner is not found', async () => {
    const { sut, usersRepository } = makeSut();

    const pet:UpdatePetParams = {
      name: 'any_name',
      age: 1,
      category: 'cat',
    };

    await usersRepository.mockUsersList();

    const promise = sut.execute({ petId: 'any_id', ownerId: 'invalid_id', data: pet });

    await expect(promise).rejects.toThrow('User not found');
  });

  test('Should throw an error if pet is not from expecified user', async () => {
    const { sut, petsRepository, usersRepository } = makeSut();

    const pet:UpdatePetParams = {
      name: 'any_name',
      age: 1,
      category: 'cat',
    };

    await usersRepository.mockUsersList();

    petsRepository.pets.push({
      id: 'not_on_any_user_pets_array',
      name: 'any_name',
      age: 1,
      category: 'cat',
      ownerId: 'none',
    });

    const promise = sut.execute({ petId: 'not_on_any_user_pets_array', ownerId: '1', data: pet });

    await expect(promise).rejects.toThrow('Pet not found on users account');
  });

  test('Should update a pet', async () => {
    const { sut, petsRepository, usersRepository } = makeSut();

    const updateData:UpdatePetParams = {
      name: 'any_name',
      age: 1,
      category: 'cat',
      pictures: ['new_pic_1'],
    };

    await usersRepository.mockUsersList();
    await petsRepository.mockPetsList();

    const petBeforeUpdate = await petsRepository.findByid('1');

    const updatedPet = await sut.execute({ petId: '1', ownerId: '1', data: updateData });

    expect(updatedPet).toEqual({ ...petBeforeUpdate, ...updateData });
  });
});
