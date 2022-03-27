/* eslint-disable max-classes-per-file */
import { Validator } from '@/presentation/protocols';
import {
  MissingParamError,
  UserAlreadyExistsError,
} from '@/presentation/errors';
import { SignUpController } from '@/presentation/controllers/auth';
import { CreateUserUseCase } from '@/data/useCases/User';
import { CreateUserParams, CreateUserRepository, FindUserByEmailRepository } from '@/data/protocols/Users';
import { User } from '@/domain/entities';
import { Encrypter } from '@/data/protocols/Encrypter';
import { badRequest, forbidden, ok } from '@/presentation/helpers';

const makeFakeRequest = () => ({
  body: {
    name: 'any_name',
    email: 'any_email',
    password: 'any_password',
    confirmPassword: 'any_password',
    avatarUrl: 'any_url',
  },
});

class ValidatorStub implements Validator {
  async validate(_password: string): Promise<Error> {
    return null;
  }
}

class FakeCreateUserRepository implements CreateUserRepository {
  async insert(user: CreateUserParams): Promise<User> {
    return {
      ...user,
      id: 'valid_id',
      password: 'hashed_password',
    };
  }
}
class FakeFindUserByEmailRepository implements FindUserByEmailRepository {
  async findByEmail(_email: string): Promise<User> {
    return null;
  }
}

class FakeEncryptionHelper implements Encrypter {
  async compare(_text: string, _hash: string): Promise<boolean> {
    return true;
  }

  async encrypt(_text: string): Promise<string> {
    return 'hashed_password';
  }
}

type MakeCreateUserUseCaseTypes ={
  createUserUseCase: CreateUserUseCase,
  fakeCreateUserRepository: FakeCreateUserRepository,
  fakeFindUserByEmailRepository: FakeFindUserByEmailRepository,
  fakeEncryptionHelper: FakeEncryptionHelper
}

const makeCreateUserUseCase = (): MakeCreateUserUseCaseTypes => {
  const fakeCreateUserRepository = new FakeCreateUserRepository();
  const fakeFindUserByEmailRepository = new FakeFindUserByEmailRepository();
  const fakeEncryptionHelper = new FakeEncryptionHelper();
  const createUserUseCase = new CreateUserUseCase(
    {
      createUserRepository: fakeCreateUserRepository,
      findUserByEmailRepository: fakeFindUserByEmailRepository,
      encryptionHelper: fakeEncryptionHelper,
    });

  return {
    createUserUseCase,
    fakeCreateUserRepository,
    fakeFindUserByEmailRepository,
    fakeEncryptionHelper,
  };
};

const makeSut = () => {
  const {
    createUserUseCase,
    fakeCreateUserRepository,
    fakeEncryptionHelper,
    fakeFindUserByEmailRepository,
  } = makeCreateUserUseCase();

  const validator = new ValidatorStub();

  const sut = new SignUpController({
    validator, createUserUseCase,
  });
  return {
    sut,
    createUserUseCase,
    fakeCreateUserRepository,
    fakeEncryptionHelper,
    fakeFindUserByEmailRepository,
    validator,
  };
};

describe('SignUpController', () => {
  test('Should call CreateUserUseCase.execute with correctParams', async () => {
    const { sut, createUserUseCase } = makeSut();
    const createUserUseCaseSpy = jest.spyOn(createUserUseCase, 'execute');

    const request = makeFakeRequest();

    await sut.handle(request);

    expect(createUserUseCaseSpy).toBeCalledTimes(1);
    expect(createUserUseCaseSpy).toBeCalledWith({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      avatarUrl: 'any_url',
    });
  });

  test('Should call validation with correctParams', async () => {
    const { sut, validator } = makeSut();
    const validateSpy = jest.spyOn(validator, 'validate');
    const request = makeFakeRequest();
    await sut.handle(request);

    expect(validateSpy).toBeCalledWith(request.body);
  });

  test('Should return 400 error if validation returns an error', async () => {
    const { sut, validator } = makeSut();
    jest.spyOn(validator, 'validate').mockImplementationOnce(async () => new MissingParamError('any_param'));
    const request = makeFakeRequest();
    const promise = await sut.handle(request);

    expect(promise).toEqual(badRequest(new MissingParamError('any_param')));
  });

  test('Should return 403 if user already exists', async () => {
    const { sut, fakeFindUserByEmailRepository } = makeSut();
    jest.spyOn(fakeFindUserByEmailRepository, 'findByEmail').mockImplementationOnce(async () => ({
      id: 'valid_id',
      name: 'valid_name',
      password: 'valid_password',
      email: 'valid_email',

    }));

    const request = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        confirmPassword: 'any_password',
        avatarUrl: 'any_url',
      },
    };
    const response = await sut.handle(request);

    expect(response).toEqual(forbidden(new UserAlreadyExistsError()));
  });

  test('Should return 200 if valid params are provided', async () => {
    const { sut } = makeSut();

    const request = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        confirmPassword: 'any_password',
        avatarUrl: 'any_url',
      },
    };

    const response = await sut.handle(request);

    expect(response).toEqual(ok({
      id: 'valid_id',
      name: 'any_name',
      email: 'any_email',
      password: 'hashed_password',
      avatarUrl: 'any_url',
      pets: [],
    }));
  });
});
