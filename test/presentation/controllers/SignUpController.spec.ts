import { HttpRequest, HttpResponse } from '@/presentation/protocols/Http';
import { Controller } from '@/presentation/protocols/Controller';

export class SignUpControllerStub implements Controller {
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    if (!httpRequest?.body?.name) {
      return {
        data: new Error('Missing Param: name'),
        statusCode: 400,
      };
    }

    if (!httpRequest?.body?.email) {
      return {
        data: new Error('Missing Param: email'),
        statusCode: 400,
      };
    }

    return {
      statusCode: 200,
    };
  }
}

const makeSut = () => {
  const sut = new SignUpControllerStub();

  return { sut };
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
    expect(response.data).toEqual(new Error('Missing Param: name'));
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
    expect(response.data).toEqual(new Error('Missing Param: email'));
  });
});
