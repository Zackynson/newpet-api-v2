import { TokenDecrypter } from '@/data/protocols';
import { LoadUserByTokenRepository } from '@/data/protocols/Users';
import { User } from '@/domain/entities';
import { LoadUserByToken } from '@/domain/useCases/User/LoadUserByToken';

export class LoadUserByTokenUseCase implements LoadUserByToken {
  private readonly tokenDecrypter: TokenDecrypter;
  private readonly loadUserByTokenRepository: LoadUserByTokenRepository;

  constructor(params: LoadUserByTokenUseCase.Params) {
    Object.assign(this, params);
  }

  async load(accessToken: string): Promise<User> {
    const token = await this.tokenDecrypter.decrypt(accessToken);

    if (token) {
      const user = await this.loadUserByTokenRepository.loadByToken(token);

      if (user?.id) {
        return user;
      }
    }

    return null;
  }
}

namespace LoadUserByTokenUseCase {
  export type Params = {
    tokenDecrypter: TokenDecrypter,
    loadUserByTokenRepository: LoadUserByTokenRepository
  }
}
