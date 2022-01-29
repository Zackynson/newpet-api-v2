/* eslint-disable max-classes-per-file */
import { Decrypter, TokenGenerator } from '@/data/protocols';
import { FindUserByEmailRepository } from '@/data/protocols/Users';
import { User } from '@/domain/entities';
import { AuthenticationUseCase } from '@/data/useCases/Auth/AutenticationUseCase';

class FakeTokenGenerator implements TokenGenerator {
  async generate(_user: User): Promise<string> {
    return 'valid_token';
  }
}

class FakeFindUserByEmailRepository implements FindUserByEmailRepository {
  async findByEmail(_email: string): Promise<User> {
    return {
      name: 'valid_name',
      email: 'valid@email.com',
      id: 'valid_id',
      password: 'valid_password',
    };
  }
}

class FakeDecryper implements Decrypter {
  async compare(_hash: string, _plainText: string): Promise<boolean> {
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

  test('Should return null if passwords doesnt match', async () => {
    const { sut, decrypter } = makeSut();
    jest.spyOn(decrypter, 'compare').mockImplementationOnce(async () => false);

    const token = await sut.auth('valid@email.com', 'invalid_password');

    expect(token).toBe(null);
  });

  test('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGenerator } = makeSut();
    jest.spyOn(tokenGenerator, 'generate').mockImplementationOnce(async (_user:User) => { throw new Error(); });

    const promise = sut.auth('any@email.com', 'any_password');

    expect(promise).rejects.toThrow();
  });

  test('Should throw if Decrypter throws', async () => {
    const { sut, decrypter } = makeSut();
    jest.spyOn(decrypter, 'compare').mockImplementationOnce(() => { throw new Error(); });

    const promise = sut.auth('any@email.com', 'any_password');

    expect(promise).rejects.toThrow();
  });

  test('Should throw if FindUserByEmailRepository throws', async () => {
    const { sut, findUserByEmailRepository } = makeSut();
    jest.spyOn(findUserByEmailRepository, 'findByEmail').mockImplementationOnce(() => { throw new Error(); });

    const promise = sut.auth('any@email.com', 'any_password');

    expect(promise).rejects.toThrow();
  });

  test('Should return a token if valid data is provided', async () => {
    const { sut } = makeSut();

    const token = await sut.auth('valid@email.com', 'valid_password');

    expect(token).toBeTruthy();
  });
});
