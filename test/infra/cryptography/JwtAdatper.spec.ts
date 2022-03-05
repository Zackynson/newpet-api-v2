import jwt from 'jsonwebtoken';
import { JwtAdapter } from '@/infra/cryptography';
import { User } from '@/domain/entities';

jest.mock('jsonwebtoken', () => ({
  async sign(): Promise<string> {
    return 'any_token';
  },

  async verify(): Promise<string> {
    return 'any_value';
  },
}));

const makeFakeUser = ():User => ({
  id: 'any_id',
  email: 'any_email',
  password: 'any_password',
  name: 'any_name',
});

const makeSut = (): JwtAdapter => new JwtAdapter({ secret: 'secret' });

describe('Jwt Adapter', () => {
  describe('generate()', () => {
    test('Should call sign with correct values', async () => {
      const sut = makeSut();
      const signSpy = jest.spyOn(jwt, 'sign');
      await sut.generate(makeFakeUser());
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
    });

    test('Should return a token on sign success', async () => {
      const sut = makeSut();
      const accessToken = await sut.generate(makeFakeUser());
      expect(accessToken).toBe('any_token');
    });

    test('Should throw if sign throws', async () => {
      const sut = makeSut();
      jest.spyOn(jwt, 'sign').mockImplementationOnce(() => { throw new Error(); });
      const promise = sut.generate(makeFakeUser());
      await expect(promise).rejects.toThrow();
    });
  });

  describe('decrypt()', () => {
    test('Should call verify with correct values', async () => {
      const sut = makeSut();
      const verifySpy = jest.spyOn(jwt, 'verify');
      await sut.decrypt('any_token');
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret');
    });

    test('Should return a decrypted value to a token', async () => {
      const sut = makeSut();
      const response = await sut.decrypt('any_token');
      expect(response).toEqual('any_value');
    });

    test('Should throw if jsonwebtoken throws', async () => {
      const sut = makeSut();
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => { throw new Error(); });

      const promise = sut.decrypt('any_token');
      await expect(promise).rejects.toThrow();
    });
  });
});
