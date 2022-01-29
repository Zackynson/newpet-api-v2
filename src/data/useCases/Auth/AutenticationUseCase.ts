import { Decrypter, TokenGenerator } from '@/data/protocols';
import { FindUserByEmailRepository } from '@/data/protocols/Users';
import { IAuthenticationUseCase } from '@/domain/useCases/Auth';

type AuthenticationUseCaseParams = {
  findUserByEmailRepository: FindUserByEmailRepository;
  decrypter: Decrypter
  tokenGenerator: TokenGenerator
}

export class AuthenticationUseCase implements IAuthenticationUseCase {
  private readonly findUserByEmailRepository: FindUserByEmailRepository;
  private readonly decrypter: Decrypter;
  private readonly tokenGenerator: TokenGenerator;

  constructor(params: AuthenticationUseCaseParams) {
    Object.assign(this, params);
  }

  async auth(email: string, password: string): Promise<string> {
    const user = await this.findUserByEmailRepository.findByEmail(email);
    if (!user) return null;

    const isEqual = await this.decrypter.compare(user.password, password);
    if (!isEqual) return null;

    return this.tokenGenerator.generate(user);
  }
}
