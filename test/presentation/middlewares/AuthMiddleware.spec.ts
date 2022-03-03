import { AuthMiddleware } from '@/presentation/middlewares';
import { forbidden } from '@/presentation/helpers';
import { AccessDeniedError } from '@/presentation/errors';
import { LoadUserByToken } from '@/domain/useCases/User/LoadUserByToken';
import { User } from '@/domain/entities';

const makeLoadUserByTokenStub = (): LoadUserByToken => {
  class LoadUserByTokenStub implements LoadUserByToken {
    async load(_accessToken: string): Promise<User> {
      return {
        id: 'any_id',
        email: 'any@email.com',
        name: 'any_name',
        password: 'any_hash',
      };
    }
  }

  return new LoadUserByTokenStub();
};

const makeFakeRequest = () => ({
  headers: {
    'x-access-token': 'any_token',
  },
});

type SutTypes = {
  loadUserByTokenStub: LoadUserByToken,
  sut: AuthMiddleware
}

const makeSut = (): SutTypes => {
  const loadUserByTokenStub = makeLoadUserByTokenStub();
  const sut = new AuthMiddleware({ loadUserByToken: loadUserByTokenStub });

  return {
    loadUserByTokenStub, sut,
  };
};

describe('Auth Middleware', () => {
  test('Should return 403 if  x-access-token header is not provided', async () => {
    const { sut } = makeSut();

    const response = await sut.handle({});
    expect(response).toEqual(forbidden(new AccessDeniedError()));
  });

  test('Should call LoadUserByToken with correct params', async () => {
    const { sut, loadUserByTokenStub } = makeSut();

    const loadSpy = jest.spyOn(loadUserByTokenStub, 'load');

    await sut.handle(makeFakeRequest());
    expect(loadSpy).toBeCalledWith('any_token');
  });

  test('Should return 403 if LoadUserByToken returns null', async () => {
    const { sut, loadUserByTokenStub } = makeSut();

    jest.spyOn(loadUserByTokenStub, 'load').mockImplementationOnce(async () => null);

    const response = await sut.handle(makeFakeRequest());
    expect(response).toEqual(forbidden(new AccessDeniedError()));
  });
});
