import { TokenDecrypter } from '@/data/protocols';
import { LoadUserByTokenUseCase } from '@/data/useCases/User/LoadUserByTokenUseCase';

const makeDecrypter = ():TokenDecrypter => {
  class DecrypterStub implements TokenDecrypter {
    async decrypt(_token: string): Promise<string> {
      return 'any_value';
    }
  }
  return new DecrypterStub();
};

type SutTypes = {
  sut:LoadUserByTokenUseCase,
  tokenDecrypter: TokenDecrypter

}

const makeSut = ():SutTypes => {
  const tokenDecrypter = makeDecrypter();
  const loadUserByToken = new LoadUserByTokenUseCase({
    tokenDecrypter,
  });

  return {
    tokenDecrypter,
    sut: loadUserByToken,
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

    expect(response).toEqual(null);
  });
});
