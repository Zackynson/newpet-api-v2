/* eslint-disable max-classes-per-file */
import { EmailValidator, PasswordValidator } from '@/presentation/protocols';
import {
  InvalidParamError,
  MissingParamError,
  ServerError,
  UserAlreadyExistsError,
} from '@/presentation/errors';
import { SignUpController } from '@/presentation/controllers/SignUp';
import { CreateUserUseCase } from '@/data/useCases/User';
import { CreateUserParams, CreateUserRepository, FindUserByEmailRepository } from '@/data/protocols/Users';
import { User } from '@/domain/entities';
import { Encrypter } from '@/data/protocols/Encrypter';

class EmailValidatorStub implements EmailValidator {
  validate(_email: string): boolean {
    return true;
  }
}
class PasswordValidatorStub implements PasswordValidator {
  validate(_password: string): boolean {
    return true;
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

class FakeEncriptionHelper implements Encrypter {
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
  fakeEncriptionHelper: FakeEncriptionHelper
}

const makeCreateUserUseCase = (): MakeCreateUserUseCaseTypes => {
  const fakeCreateUserRepository = new FakeCreateUserRepository();
  const fakeFindUserByEmailRepository = new FakeFindUserByEmailRepository();
  const fakeEncriptionHelper = new FakeEncriptionHelper();
  const createUserUseCase = new CreateUserUseCase(
    fakeCreateUserRepository,
    fakeFindUserByEmailRepository,
    fakeEncriptionHelper);

  return {
    createUserUseCase,
    fakeCreateUserRepository,
    fakeFindUserByEmailRepository,
    fakeEncriptionHelper,
  };
};

const makeSut = () => {
  const emailValidator = new EmailValidatorStub();
  const passwordValidator = new PasswordValidatorStub();
  const {
    createUserUseCase,
    fakeCreateUserRepository,
    fakeEncriptionHelper,
    fakeFindUserByEmailRepository,
  } = makeCreateUserUseCase();
  const sut = new SignUpController(emailValidator, passwordValidator, createUserUseCase);
  return {
    sut,
    emailValidator,
    passwordValidator,
    createUserUseCase,
    fakeCreateUserRepository,
    fakeEncriptionHelper,
    fakeFindUserByEmailRepository,
  };
};

describe('SignUpController', () => {
  test('Should returns 400 if no name is provided', async () => {
    const { sut } = makeSut();

    const request = {
      body: {
        email: 'any_email',
        password: 'any_password',
        confirmPassword: 'any_password',
        avatarUrl: 'any_url',
      },
    };

    const response = await sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.data).toEqual(new MissingParamError('name'));
  });

  test('Should returns 400 if no email is provided', async () => {
    const { sut } = makeSut();

    const request = {
      body: {
        name: 'any_name',
        password: 'any_password',
        confirmPassword: 'any_password',
        avatarUrl: 'any_url',
      },
    };

    const response = await sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.data).toEqual(new MissingParamError('email'));
  });

  test('Should returns 400 if an invalid mail is provided', async () => {
    const { sut, emailValidator } = makeSut();
    jest.spyOn(emailValidator, 'validate').mockReturnValueOnce(false);

    const request = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'any_password',
        confirmPassword: 'any_password',
        avatarUrl: 'any_url',
      },
    };

    const response = await sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.data).toEqual(new InvalidParamError('email'));
  });

  test('Should returns 400 if an invalid password is provided', async () => {
    const { sut, passwordValidator } = makeSut();
    jest.spyOn(passwordValidator, 'validate').mockReturnValueOnce(false);

    const request = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'invalid_password',
        confirmPassword: 'invalid_password',
        avatarUrl: 'any_url',
      },
    };

    const response = await sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.data).toEqual(new InvalidParamError('password'));
  });

  test('Should returns 400 if password is not provided', async () => {
    const { sut } = makeSut();

    const request = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        confirmPassword: 'any_password',
        avatarUrl: 'any_url',
      },
    };

    const response = await sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.data).toEqual(new MissingParamError('password'));
  });

  test('Should returns 400 if passwordConfirmation is not provided', async () => {
    const { sut } = makeSut();

    const request = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'any_password',
        avatarUrl: 'any_url',
      },
    };

    const response = await sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.data).toEqual(new MissingParamError('confirmPassword'));
  });

  test('Should returns 400 if passwordConfirmation is different from password', async () => {
    const { sut } = makeSut();

    const request = {
      body: {
        name: 'any_name',
        email: 'invalid_email',
        password: 'any_password',
        confirmPassword: 'invalid_password',
        avatarUrl: 'any_url',
      },
    };

    const response = await sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.data).toEqual(new InvalidParamError('confirmPassword'));
  });

  test('Should returns 500 if emailValidator throws', async () => {
    const { sut, emailValidator } = makeSut();

    jest.spyOn(emailValidator, 'validate').mockImplementationOnce(() => {
      throw new Error();
    });

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

    expect(response.statusCode).toBe(500);
    expect(response.data).toEqual(new ServerError());
  });

  test('Should call CreateUserUseCase.execute with correctParams', async () => {
    const { sut, createUserUseCase } = makeSut();
    const createUserUseCaseSpy = jest.spyOn(createUserUseCase, 'execute');

    const request = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        confirmPassword: 'any_password',
        avatarUrl: 'any_url',
      },
    };

    await sut.handle(request);

    expect(createUserUseCaseSpy).toBeCalledTimes(1);
    expect(createUserUseCaseSpy).toBeCalledWith({
      name: 'any_name',
      email: 'any_email',
      password: 'any_password',
      avatarUrl: 'any_url',
    });
  });

  test('Should return 400 if no params are provided', async () => {
    const { sut } = makeSut();

    const response = await sut.handle({});

    expect(response.statusCode).toBe(400);
    expect(response.data).toEqual(new MissingParamError('name'));
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

    expect(response.statusCode).toBe(403);
    expect(response.data).toEqual(new UserAlreadyExistsError());
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

    expect(response.statusCode).toBe(200);
    expect(response.data).toEqual({
      id: 'valid_id',
      name: 'any_name',
      email: 'any_email',
      password: 'hashed_password',
      avatarUrl: 'any_url',
      pets: [],
    });
  });
});
