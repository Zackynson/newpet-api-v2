import { MemoryPetsRepository } from '@/infra/repositories';
import { Pet } from '@/domain/entities';
import { ListPetsUseCase } from '@/data/useCases/Pets';

describe('ListPetsUseCase', () => {
  const makeSut = () => {
    const petsRepository = new MemoryPetsRepository();
    const sut = new ListPetsUseCase(petsRepository);

    return { sut, petsRepository };
  };

  test('Should bring a list of pets', async () => {
    const { sut, petsRepository } = makeSut();

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

    petsRepository.pets.push(...petsMock);

    const petsList = await sut.execute();

    expect(petsList).toEqual(petsMock);
  });

  test('Should bring an empty list of pets', async () => {
    const { sut } = makeSut();

    const petsList = await sut.execute();

    expect(petsList).toEqual([]);
  });
});
