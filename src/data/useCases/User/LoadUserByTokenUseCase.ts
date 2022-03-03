import { TokenDecrypter } from '@/data/protocols';
import { User } from '@/domain/entities';
import { LoadUserByToken } from '@/domain/useCases/User/LoadUserByToken';

export class LoadUserByTokenUseCase implements LoadUserByToken {
  private readonly tokenDecrypter: TokenDecrypter;

  constructor(params: LoadUserByTokenUseCase.Params) {
    Object.assign(this, params);
  }

  async load(accessToken: string): Promise<User> {
    await this.tokenDecrypter.decrypt(accessToken);

    return null;
  }
}

namespace LoadUserByTokenUseCase {
  export type Params = {
    tokenDecrypter: TokenDecrypter
  }
}
