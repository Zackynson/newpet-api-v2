/* eslint-disable max-classes-per-file */
import { MissingParamError, InvalidParamError } from '@/presentation/errors';
import { SignInController } from '@/presentation/controllers';
import { EmailValidator, PasswordValidator } from '@/presentation/protocols';

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

type SutTypes = {
  sut: SignInController,
  emailValidator: EmailValidator,
  passwordValidator: PasswordValidator,
}

const makeSut = (): SutTypes => {
  const emailValidator = new FakeEmailValidator();
  const passwordValidator = new FakePasswordValidator();
  const sut = new SignInController(emailValidator, passwordValidator);

  return {
    sut,
    emailValidator,
    passwordValidator,
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

    expect(response.statusCode).toBe(400);
    expect(response.data).toEqual(new MissingParamError('email'));
  });

  test('Should returns 400 if no password is provided', async () => {
    const { sut } = makeSut();

    const request = {
      body: {
        email: 'any_email',
      },
    };

    const response = await sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.data).toEqual(new MissingParamError('password'));
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

    expect(response.statusCode).toBe(400);
    expect(response.data).toEqual(new InvalidParamError('email'));
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

    expect(response.statusCode).toBe(400);
    expect(response.data).toEqual(new InvalidParamError('password'));
  });
});
