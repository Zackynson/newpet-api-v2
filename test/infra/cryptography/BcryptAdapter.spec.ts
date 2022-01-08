import bcrypt from 'bcrypt';
import { BcryptAdapter } from '@/infra/cryptography/BcryptAdapter';

describe('BcryptAdapter', () => {
  test('Should call bcrypt with correct params', async () => {
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    await sut.encrypt('any_value');

    expect(hashSpy).toBeCalledWith('any_value', salt);
  });

  test('Should return a hash on success', async () => {
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => 'hashed_value');
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const hash = await sut.encrypt('any_value');

    expect(hash).toBe('hashed_value');
  });
});
