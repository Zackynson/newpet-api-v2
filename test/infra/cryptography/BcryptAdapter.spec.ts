import bcrypt from 'bcrypt';
import { BcryptAdapter } from '@/infra/cryptography/BcryptAdapter';

const salt = 12;
const makeSut = ():BcryptAdapter => new BcryptAdapter(salt);

describe('BcryptAdapter', () => {
  test('Should call bcrypt with correct params', async () => {
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    const sut = makeSut();
    await sut.encrypt('any_value');

    expect(hashSpy).toBeCalledWith('any_value', salt);
  });

  test('Should return a hash on success', async () => {
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hashed_value');
    const sut = makeSut();
    const hash = await sut.encrypt('any_value');

    expect(hash).toBe('hashed_value');
  });

  test('Should throw if bcrypt throws', async () => {
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => { throw new Error(); });
    const sut = makeSut();
    const promise = sut.encrypt('any_value');

    expect(promise).rejects.toThrow();
  });
});
