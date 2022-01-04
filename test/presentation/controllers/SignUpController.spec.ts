/* eslint-disable max-classes-per-file */
import { badRequest, ok, serverError } from '@/presentation/helpers';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/Http';
import { Controller, EmailValidator } from '@/presentation/protocols';
import { InvalidParamError, MissingParamError, ServerError } from '@/presentation/errors';

export class SignUpControllerMock implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email } = httpRequest.body || {};

      if (!name) return badRequest(new MissingParamError('name'));

      if (!email) return badRequest(new MissingParamError('email'));

      const emailIsValid = this.emailValidator.validate(email);

      if (!emailIsValid) return badRequest(new InvalidParamError('email'));

      return ok();
    } catch (error) {
      return serverError();
    }
  }
}

class EmailValidatorStub implements EmailValidator {
  validate(email: string): boolean {
    return true;
  }
}

class EmailValidatorWithError implements EmailValidator {
  validate(email: string): boolean {
    throw new Error();
  }
}

const makeSut = () => {
  const emailValidator = new EmailValidatorStub();
  const sut = new SignUpControllerMock(emailValidator);

  return { sut, emailValidator };
};

describe('SignUpController', () => {
  test('Should returns 400 if no name is provided', async () => {
    const { sut } = makeSut();

    const request = {
      body: {
        email: 'any_email',
        password: 'any_password',
        confirmPassword: 'any_password',
        avatarUrl: 'any_password',
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
        avatarUrl: 'any_password',
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
        avatarUrl: 'any_password',
      },
    };

    const response = await sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.data).toEqual(new InvalidParamError('email'));
  });

  test('Should returns 500 if emailValidator throws', async () => {
    const emailValidatorWithError = new EmailValidatorWithError();
    const sut = new SignUpControllerMock(emailValidatorWithError);

    const request = {
      body: {
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        confirmPassword: 'any_password',
        avatarUrl: 'any_password',
      },
    };

    const response = await sut.handle(request);

    expect(response.statusCode).toBe(500);
    expect(response.data).toEqual(new ServerError());
  });
});
