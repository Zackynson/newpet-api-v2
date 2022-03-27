/* eslint-disable max-classes-per-file */
import { RegisterPetUseCase } from '@/data/useCases/Pets/RegisterPetUseCase';
import { RegisterPetDTO } from '@/domain/useCases/Pets/RegisterPet';
import { RegisterPetData, RegisterPetRepository } from '@/data/protocols/Pets/RegisterPetRepository';
import { UpdateUserPetsParams, UpdateUserPetsRepository } from '@/data/protocols/Users';
import { Pet } from '@/domain/entities';

class FakeRegisterPetRepo implements RegisterPetRepository {
  async register(_params: RegisterPetData): Promise<Pet> {
    return {
      id: 'any_id',
      age: 1,
      category: 'cat',
      name: 'any_name',
      ownerId: 'any_owner_id',
    };
  }
}

class FakeUpdateUserPetsRepository implements UpdateUserPetsRepository {
  async addPet(_params: UpdateUserPetsParams): Promise<void> {
    return null;
  }
}

const makeSut = () => {
  const registerPetRepository = new FakeRegisterPetRepo();
  const updateUserPetsRepository = new FakeUpdateUserPetsRepository();
  const sut = new RegisterPetUseCase({
    registerPetRepository,
    updateUserPetsRepository,

  });

  return {
    registerPetRepository,
    updateUserPetsRepository,
    sut,
  };
};

const makeFakeDto = ():RegisterPetDTO => ({
  age: 1,
  category: 'cat',
  name: 'any_name',
  ownerId: 'any_owner_id',
  pictures: ['pic1.jpg', 'pic2.png'],
});

describe('RegisterPetUseCase', () => {
  test('Should call RegisterPetRepository with correct params', async () => {
    const { sut, registerPetRepository } = makeSut();

    const registerSpy = jest.spyOn(registerPetRepository, 'register');
    await sut.register(makeFakeDto());

    expect(registerSpy).toBeCalledWith(makeFakeDto());
  });

  test('Should throw if RegisterPetRepository throws', async () => {
    const { sut, registerPetRepository } = makeSut();

    jest.spyOn(registerPetRepository, 'register').mockImplementationOnce(() => {
      throw new Error('any_error');
    });

    const promise = sut.register(makeFakeDto());

    await expect(promise).rejects.toThrow(new Error('any_error'));
  });

  test('Should call UpdateUsersPetsRepository with correct params', async () => {
    const { sut, updateUserPetsRepository } = makeSut();

    const registerSpy = jest.spyOn(updateUserPetsRepository, 'addPet');
    await sut.register(makeFakeDto());

    expect(registerSpy).toBeCalledWith({
      petId: 'any_id',
      userId: 'any_owner_id',
    });
  });

  test('Should throw if RegisterPetRepository throws', async () => {
    const { sut, updateUserPetsRepository } = makeSut();

    jest.spyOn(updateUserPetsRepository, 'addPet').mockImplementationOnce(() => {
      throw new Error('any_error');
    });

    const promise = sut.register(makeFakeDto());

    await expect(promise).rejects.toThrow(new Error('any_error'));
  });
});
