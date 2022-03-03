/* eslint-disable max-classes-per-file */
import { TokenDecrypter } from '@/data/protocols';
import { LoadUserByTokenRepository } from '@/data/protocols/Users';
import { LoadUserByTokenUseCase } from '@/data/useCases/User/LoadUserByTokenUseCase';
import { User } from '@/domain/entities';

const makeDecrypter = ():TokenDecrypter => {
  class DecrypterStub implements TokenDecrypter {
    async decrypt(_token: string): Promise<string> {
      return 'any_value';
    }
  }
  return new DecrypterStub();
};

const makeFakeUser = ():User => ({
  id: 'any_id',
  email: 'any@email.com',
  password: 'any_password',
  name: 'any_name',
});

const makeLoadUserByTokenRepository = ():LoadUserByTokenRepository => {
  class LoadUserByTokenRepositoryStub implements LoadUserByTokenRepository {
    async loadByToken(token: string): Promise<User> {
      return makeFakeUser();
    }
  }
  return new LoadUserByTokenRepositoryStub();
};

type SutTypes = {
  sut:LoadUserByTokenUseCase,
  tokenDecrypter: TokenDecrypter,
  loadUserByTokenRepository: LoadUserByTokenRepository

}

const makeSut = ():SutTypes => {
  const tokenDecrypter = makeDecrypter();
  const loadUserByTokenRepository = makeLoadUserByTokenRepository();
  const sut = new LoadUserByTokenUseCase({
    tokenDecrypter,
    loadUserByTokenRepository,
  });

  return {
    tokenDecrypter,
    loadUserByTokenRepository,
    sut,
  };
};

describe('LoadUserByTokenUseCase', () => {
  test('Should call decrypter with correct values', async () => {
    const { sut, tokenDecrypter } = makeSut();
    const decryptSpy = jest.spyOn(tokenDecrypter, 'decrypt');

    await sut.load('any_hash');

    expect(decryptSpy).toBeCalledWith('any_hash');
  });

  test('Should return null if decrypter returns null', async () => {
    const { sut, tokenDecrypter } = makeSut();
    jest.spyOn(tokenDecrypter, 'decrypt').mockImplementationOnce(async () => null);

    const response = await sut.load('any_hash');

    expect(response).toBeNull();
  });

  test('Should call LoadUserByTokenRepository with correct values', async () => {
    const { sut, loadUserByTokenRepository } = makeSut();
    const loadByTokenSpy = jest.spyOn(loadUserByTokenRepository, 'loadByToken');

    await sut.load('any_hash');

    expect(loadByTokenSpy).toBeCalledWith('any_value');
  });

  test('Should return null if LoadUserByTokenRepository returns null', async () => {
    const { sut, loadUserByTokenRepository } = makeSut();
    jest.spyOn(loadUserByTokenRepository, 'loadByToken').mockImplementationOnce(async () => null);

    const response = await sut.load('any_hash');

    expect(response).toBeNull();
  });

  test('Should return an user if LoadUserByTokenRepository succeeds', async () => {
    const { sut } = makeSut();
    const response = await sut.load('any_hash');
    expect(response).toEqual(makeFakeUser());
  });

  test('Should throw if LoadUserByTokenRepository throws', async () => {
    const { sut, loadUserByTokenRepository } = makeSut();
    jest.spyOn(loadUserByTokenRepository, 'loadByToken').mockImplementationOnce(async () => { throw new Error(); });

    const promise = sut.load('any_hash');
    expect(promise).rejects.toThrow();
  });
});
