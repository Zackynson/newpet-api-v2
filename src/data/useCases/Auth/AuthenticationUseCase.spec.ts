/* eslint-disable max-classes-per-file */
import e from 'express';
import { Decrypter, TokenGenerator } from '@/data/protocols';
import { FindUserByEmailRepository } from '@/data/protocols/Users';
import { User } from '@/domain/entities';
import { AuthenticationUseCase } from './AutenticationUseCase';

class FakeTokenGenerator implements TokenGenerator {
  async generate(user: User): Promise<string> {
    return 'valid_token';
  }
}

class FakeFindUserByEmailRepository implements FindUserByEmailRepository {
  async findByEmail(email: string): Promise<User> {
    return {
      name: 'valid_name',
      email: 'valid@email.com',
      id: 'valid_id',
      password: 'valid_password',
    };
  }
}

class FakeDecryper implements Decrypter {
  async compare(hash: string, plainText: string): Promise<boolean> {
    return true;
  }
}

const makeSut = () => {
  const tokenGenerator = new FakeTokenGenerator();
  const findUserByEmailRepository = new FakeFindUserByEmailRepository();
  const decrypter = new FakeDecryper();
  const sut = new AuthenticationUseCase({ tokenGenerator, findUserByEmailRepository, decrypter });

  return {
    tokenGenerator, findUserByEmailRepository, decrypter, sut,
  };
};

describe('AuthenticationUseCase', () => {
  test('Should return null if user is not found', async () => {
    const { sut, findUserByEmailRepository } = makeSut();
    jest.spyOn(findUserByEmailRepository, 'findByEmail').mockImplementationOnce(async (_email:string) => null);

    const token = await sut.auth('invalid@email.com', 'any_password');

    expect(token).toBe(null);
  });
});
