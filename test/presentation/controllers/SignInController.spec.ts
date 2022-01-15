/* eslint-disable max-classes-per-file */
import { MissingParamError, InvalidParamError } from '@/presentation/errors';
import { SignInController } from '@/presentation/controllers';
import { EmailValidator, PasswordValidator } from '@/presentation/protocols';
import {
  serverError, badRequest, unauthorized, ok,
} from '@/presentation/helpers';
import { IAuthenticationUseCase } from '@/domain/useCases/Auth';

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

class FakeAuthenticationUseCase implements IAuthenticationUseCase {
  async auth(_email: string, _password: string): Promise<string> {
    return 'any_token';
  }
}

const makeFakeRequest = () => ({
  body: {
    email: 'any_email',
    password: 'any_password',
  },
});

type SutTypes = {
  sut: SignInController,
  emailValidator: EmailValidator,
  passwordValidator: PasswordValidator,
  authenticationUseCase: IAuthenticationUseCase
}

const makeSut = (): SutTypes => {
  const emailValidator = new FakeEmailValidator();
  const passwordValidator = new FakePasswordValidator();
  const authenticationUseCase = new FakeAuthenticationUseCase();
  const sut = new SignInController({
    emailValidator,
    passwordValidator,
    authenticationUseCase,
  });

  return {
    sut,
    emailValidator,
    passwordValidator,
    authenticationUseCase,
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

    const response = await sut.handle(makeFakeRequest());

    expect(response).toEqual(serverError());
  });

  test('Should returns 500 if passwordValidator throws', async () => {
    const { sut, passwordValidator } = makeSut();

    jest.spyOn(passwordValidator, 'validate').mockImplementationOnce(() => {
      throw new Error();
    });

    const response = await sut.handle(makeFakeRequest());

    expect(response).toEqual(serverError());
  });

  test('Should call autenticationUseCase with correct values', async () => {
    const { sut, authenticationUseCase } = makeSut();

    const authSpy = jest.spyOn(authenticationUseCase, 'auth');

    const request = makeFakeRequest();

    await sut.handle(request);

    expect(authSpy).toBeCalledWith(request.body.email, request.body.password);
  });

  test('Should return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationUseCase } = makeSut();

    jest.spyOn(authenticationUseCase, 'auth').mockImplementation(async () => null);

    const request = {
      body: {
        email: 'invalid_email',
        password: 'invalid_email',
      },
    };

    const respose = await sut.handle(request);

    expect(respose).toEqual(unauthorized());
  });

  test('Should returns 500 if authenticationUseCase throws', async () => {
    const { sut, authenticationUseCase } = makeSut();

    jest.spyOn(authenticationUseCase, 'auth').mockImplementationOnce(() => {
      throw new Error();
    });

    const response = await sut.handle(makeFakeRequest());

    expect(response).toEqual(serverError());
  });

  test('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut();

    const respose = await sut.handle(makeFakeRequest());

    expect(respose).toEqual(ok({ access_token: 'any_token' }));
  });
});
