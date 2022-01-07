/* eslint-disable max-classes-per-file */
import { EmailValidator } from '@/presentation/protocols';
import { InvalidParamError, MissingParamError, ServerError } from '@/presentation/errors';
import { SignUpController } from '@/presentation/controllers/SignUp';
import { CreateUserUseCase } from '@/data/useCases/User';
import { CreateUserParams, UpdateUserParams, UsersRepository } from '@/data/protocols';
import { User } from '@/domain/entities';
import { Encrypter } from '@/data/protocols/Encrypter';

class EmailValidatorStub implements EmailValidator {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(_email: string): boolean {
    return true;
  }
}

class FakeUsersRepository implements UsersRepository {
  async insert(user: CreateUserParams): Promise<User> {
    return {
      ...user,
      id: 'valid_id',
    };
  }

  async list(): Promise<User[]> {
    return [];
  }

  async findById(_id: string): Promise<User> {
    return null;
  }

  async findByEmail(_email: string): Promise<User> {
    return null;
  }

  async delete(_id: string): Promise<void> {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async update({ id, data }: { id: string; data: UpdateUserParams; }): Promise<void> {
    return null;
  }
}

class FakeEncriptionHelper implements Encrypter {
  async compare(_text: string, _hash: string): Promise<boolean> {
    return true;
  }

  async encrypt(text: string): Promise<string> {
    return text;
  }
}

const makeCreateUserUseCase = (): CreateUserUseCase => {
  const fakeUsersRepository = new FakeUsersRepository();
  const fakeEncriptionHelper = new FakeEncriptionHelper();
  const createUserUseCase = new CreateUserUseCase(fakeUsersRepository, fakeEncriptionHelper);

  return createUserUseCase;
};

const makeSut = () => {
  const emailValidator = new EmailValidatorStub();
  const createUserUseCase = makeCreateUserUseCase();
  const sut = new SignUpController(emailValidator, createUserUseCase);
  return { sut, emailValidator, createUserUseCase };
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
      password: 'any_password',
      avatarUrl: 'any_url',
      pets: [],
    });
  });
});
