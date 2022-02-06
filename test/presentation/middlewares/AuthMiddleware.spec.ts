import { HttpRequest } from '@/presentation/protocols';
import { AuthMiddleware } from '@/presentation/middlewares';
import { forbidden } from '@/presentation/helpers';
import { AccessDeniedError } from '@/presentation/errors';

describe('Auth Middleware', () => {
  test('Should return 403 if  x-access-token header is not provided', async () => {
    const sut = new AuthMiddleware();
    const httpRequest: HttpRequest = {};

    const response = await sut.handle(httpRequest);

    expect(response).toEqual(forbidden(new AccessDeniedError()));
  });
});
