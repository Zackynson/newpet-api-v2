/* eslint-disable max-classes-per-file */
import { MissingParamError, InvalidParamError } from '@/presentation/errors';
import { SignInController } from '@/presentation/controllers';
import { EmailValidator, PasswordValidator } from '@/presentation/protocols';
import { IFindUserByEmailUseCase } from '@/domain/useCases/User';
import { User } from '@/domain/entities';
import { notFound, serverError, badRequest } from '@/presentation/helpers';
import { Decrypter } from '@/data/protocols';

class FakeEmailValidator implements EmailValidator {
  validate(_email: string): boolean {
    return true;
  }
}
class FakePasswordValidator implements PasswordValidator {
  validate(_password: string): boolean {
    return true;
  }
}

class FakeFindUserByEmailUseCase implements IFindUserByEmailUseCase {
  async execute(email: string): Promise<User> {
    return {
      email,
      id: 'valid_id',
      name: 'valid_name',
      password: 'valid_password',
      avatarUrl: 'valid_url',
      pets: [],
    };
  }
}

class FakeDecrypter implements Decrypter {
  async compare(_hash: string, _plainText: string): Promise<boolean> {
    return true;
  }
}

type SutTypes = {
  sut: SignInController,
  emailValidator: EmailValidator,
  passwordValidator: PasswordValidator,
  findUserByEmailUseCase: IFindUserByEmailUseCase,
  decrypter: FakeDecrypter
}

const makeSut = (): SutTypes => {
  const emailValidator = new FakeEmailValidator();
  const passwordValidator = new FakePasswordValidator();
  const findUserByEmailUseCase = new FakeFindUserByEmailUseCase();
  const decrypter = new FakeDecrypter();
  const sut = new SignInController({
    emailValidator,
    passwordValidator,
    findUserByEmailUseCase,
    decrypter,
  });

  return {
    sut,
    emailValidator,
    passwordValidator,
    findUserByEmailUseCase,
    decrypter,
  };
};

describe('SignInController', () => {
  test('Should returns 400 if no email is provided', async () => {
    const { sut } = makeSut();

    const request = {
      body: {
        password: 'any_password',
      },
    };

    const response = await sut.handle(request);

    expect(response).toEqual(badRequest(new MissingParamError('email')));
  });

  test('Should returns 400 if no password is provided', async () => {
    const { sut } = makeSut();

    const request = {
      body: {
        email: 'any_email',
      },
    };

    const response = await sut.handle(request);

    expect(response).toEqual(badRequest(new MissingParamError('password')));
  });

  test('Should returns 400 if an invalid email is provided', async () => {
    const { sut, emailValidator } = makeSut();

    jest.spyOn(emailValidator, 'validate').mockImplementation(() => false);

    const request = {
      body: {
        email: 'invalid_mail',
        password: 'any_password',
      },
    };

    const response = await sut.handle(request);

    expect(response).toEqual(badRequest(new InvalidParamError('email')));
  });

  test('Should returns 400 if an invalid password is provided', async () => {
    const { sut, passwordValidator } = makeSut();

    jest.spyOn(passwordValidator, 'validate').mockImplementation(() => false);

    const request = {
      body: {
        email: 'invalid_mail',
        password: 'any_password',
      },
    };

    const response = await sut.handle(request);

    expect(response).toEqual(badRequest(new InvalidParamError('password')));
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

    expect(response).toEqual(serverError());
  });

  test('Should returns 500 if passwordValidator throws', async () => {
    const { sut, passwordValidator } = makeSut();

    jest.spyOn(passwordValidator, 'validate').mockImplementationOnce(() => {
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

    expect(response).toEqual(serverError());
  });

  test('Should returns 404 if user is not found', async () => {
    const { sut, findUserByEmailUseCase } = makeSut();

    jest.spyOn(findUserByEmailUseCase, 'execute').mockImplementation(() => null);

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

    expect(response).toEqual(notFound(new Error('User not found')));
  });

  test('Should returns 404 if password does not match', async () => {
    const { sut, decrypter } = makeSut();

    jest.spyOn(decrypter, 'compare').mockImplementation(async () => false);

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

    expect(response).toEqual(notFound(new Error('User not found')));
  });
});
