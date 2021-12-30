import { Pet } from '@/domain/entities';
import { RegisterPetUseCase } from '@/data/useCases/Pets';
import { MemoryPetsRepository } from '@/infra/repositories/MemoryPetsRepository';
import { MemoryUsersRepository } from '@/infra/repositories';

describe('RegisterPetUseCase', () => {
  test('Should register a pet', async () => {
    const pet:Pet = {
      name: 'any_name',
      age: 1,
      category: 'cat',
      ownerId: '1',
    };

    const petsRepository = new MemoryPetsRepository();
    const usersRepository = new MemoryUsersRepository();
    const registerPetUseCase = new RegisterPetUseCase(petsRepository, usersRepository);

    await usersRepository.mockUsersList();

    const promise = registerPetUseCase.execute(pet);

    await expect(promise).resolves.not.toThrow();
  });

  test('Should include pet id on its owner pets array', async () => {
    const pet:Pet = {
      name: 'any_name',
      age: 1,
      category: 'cat',
      ownerId: '1',
    };

    const petsRepository = new MemoryPetsRepository();
    const usersRepository = new MemoryUsersRepository();
    const registerPetUseCase = new RegisterPetUseCase(petsRepository, usersRepository);

    await usersRepository.mockUsersList();
    const registeredPet = await registerPetUseCase.execute(pet);

    const petowner = usersRepository.users.find((user) => user.id === pet.ownerId);

    expect(petsRepository?.pets?.includes(registeredPet)).toBe(true);
    expect(petowner?.pets?.includes(registeredPet.id)).toBe(true);
  });

  test('Should create pets array if user doesnt have one', async () => {
    const pet:Pet = {
      name: 'any_name',
      age: 1,
      category: 'cat',
      ownerId: '1',
    };

    const petsRepository = new MemoryPetsRepository();
    const usersRepository = new MemoryUsersRepository();
    const registerPetUseCase = new RegisterPetUseCase(petsRepository, usersRepository);

    await usersRepository.insert({
      name: 'user_without_pets_array',
      email: 'user_without@pets_array.com',
      password: '12345678',
    });

    const registeredPet = await registerPetUseCase.execute(pet);

    const petowner = usersRepository.users.find((user) => user.id === pet.ownerId);

    expect(petsRepository?.pets?.includes(registeredPet)).toBe(true);
    expect(petowner?.pets?.includes(registeredPet.id)).toBe(true);
  });

  test('Should throw an error if ownerId is invalid', async () => {
    const pet:Pet = {
      name: 'any_name',
      age: 1,
      category: 'cat',
      ownerId: 'invalid_id',
    };

    const petsRepository = new MemoryPetsRepository();
    const usersRepository = new MemoryUsersRepository();
    const registerPetUseCase = new RegisterPetUseCase(petsRepository, usersRepository);

    const promise = registerPetUseCase.execute(pet);

    await expect(promise).rejects.toThrow('User not found');
    expect(petsRepository.pets.includes(pet)).toBe(false);
  });
});
