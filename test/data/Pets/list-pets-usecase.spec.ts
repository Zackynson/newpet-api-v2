import { MemoryPetsRepository } from '@/infra/repositories/MemoryPetsRepository';
import { Pet } from '@/domain/entities';
import { ListPetsUseCase } from '@/data/useCases/Pets';

describe('ListPetsUseCase', () => {
  test('Should bring a list of pets', async () => {
    const petsMock:Pet[] = [{
      id: '1',
      name: 'any_name',
      age: 1,
      category: 'cat',
      ownerId: '1',
    }, {
      id: '2',
      name: 'any_name_2',
      age: 1,
      category: 'dog',
      ownerId: '1',
    }, {
      id: '3',
      name: 'any_name_3',
      age: 1,
      category: 'bird',
      ownerId: '1',
    }];

    const petsRepository = new MemoryPetsRepository();
    const listPetsUseCase = new ListPetsUseCase(petsRepository);

    petsRepository.pets.push(...petsMock);

    const petsList = await listPetsUseCase.execute();

    expect(petsList).toEqual(petsMock);
  });

  test('Should bring an empty list of pets', async () => {
    const petsRepository = new MemoryPetsRepository();
    const listPetsUseCase = new ListPetsUseCase(petsRepository);

    const petsList = await listPetsUseCase.execute();

    expect(petsList).toEqual([]);
  });
});
