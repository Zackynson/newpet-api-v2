/* eslint-disable max-classes-per-file */
import { RegisterPet, RegisterPetDTO } from '@/domain/useCases/Pets/RegisterPet';
import { RegisterPetController } from '@/presentation/controllers/pets/RegisterPetController';
import { MissingParamError } from '@/presentation/errors';
import { badRequest, ok, serverError } from '@/presentation/helpers';
import { Validator } from '@/presentation/protocols';

class RegisterPetUseCase implements RegisterPet {
  async register(_params: RegisterPetDTO): Promise<void> {
    return null;
  }
}

class FakeValidator implements Validator {
  async validate(_input:any): Promise<Error> {
    return null;
  }
}

const makeSut = () => {
  const registerPetUseCase = new RegisterPetUseCase();
  const validator = new FakeValidator();
  const sut = new RegisterPetController({
    registerPetUseCase,
    validator,
  });

  return {
    registerPetUseCase, sut, validator,
  };
};

const makeFakeRequest = () => ({
  body: {
    any_param: 1,
  },
  userId: 'any_id',
});

describe('RegisterPetController', () => {
  test('Should call RegisterPetUseCase with correctParams', async () => {
    const {
      registerPetUseCase, sut,
    } = makeSut();
    const registerSpy = jest.spyOn(registerPetUseCase, 'register');

    await sut.handle({
      body: {
        any_param: 1,
      },
      userId: 'any_id',
    });

    expect(registerSpy).toBeCalledWith({
      any_param: 1,
      ownerId: 'any_id',
    });
  });

  test('Should return 400 error if validation returns an error', async () => {
    const { sut, validator } = makeSut();
    jest.spyOn(validator, 'validate').mockImplementationOnce(async () => new MissingParamError('any_param'));

    const response = await sut.handle(makeFakeRequest());

    expect(response).toEqual(badRequest(new MissingParamError('any_param')));
  });

  test('Should return 500 if validator throws', async () => {
    const { sut, validator } = makeSut();
    jest.spyOn(validator, 'validate').mockImplementationOnce(async () => { throw new Error(); });

    const promise = await sut.handle(makeFakeRequest());

    expect(promise).toEqual(serverError());
  });

  test('Should return 200 if RegisterPetUseCase succeeds', async () => {
    const { sut } = makeSut();

    const response = await sut.handle(makeFakeRequest());

    expect(response).toEqual(ok({
      message: 'Pet registrado com sucesso',
    }));
  });
});
