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
});
