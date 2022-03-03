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

describe('LoadUserByTokenUseCase', () => {
  test('Should call decrypter with correct values', async () => {
    const decrypterStub = makeDecrypter();
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt');

    const loadUserByToken = new LoadUserByTokenUseCase({
      tokenDecrypter: decrypterStub,
    });

    await loadUserByToken.load('any_hash');

    expect(decryptSpy).toBeCalledWith('any_hash');
  });
});
