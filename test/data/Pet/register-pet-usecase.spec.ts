import { Pet } from '@/domain/entities';
import { RegisterPetUseCase } from '@/data/useCases/Pets';
import { MemoryPetsRepository } from '@/infra/repositories/MemoryPetsRepository';

describe('RegisterPetUseCase', () => {
  test('Should register a pet for a valid user', async () => {
    const pet:Pet = {
      name: 'any_name',
      age: 1,
      category: 'cat',
      ownerId: 'any_id',
    };

    const petsRepository = new MemoryPetsRepository();
    const registerPetUseCase = new RegisterPetUseCase(petsRepository);

    const promise = registerPetUseCase.execute(pet);

    await expect(promise).resolves.not.toThrow();
    expect(petsRepository.pets.includes(pet)).toBe(true);
  });
});
