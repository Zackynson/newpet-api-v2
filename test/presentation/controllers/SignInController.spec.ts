import { MissingParamError } from '@/presentation/errors';
import { SignInController } from '@/presentation/controllers';

const makeSut = (): SignInController => new SignInController();

describe('SignInController', () => {
  test('Should returns 400 if no email is provided', async () => {
    const sut = makeSut();

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
    const sut = makeSut();

    const request = {
      body: {
        email: 'any_email',
      },
    };

    const response = await sut.handle(request);

    expect(response.statusCode).toBe(400);
    expect(response.data).toEqual(new MissingParamError('password'));
  });
});
