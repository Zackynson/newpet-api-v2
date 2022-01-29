import jwt from 'jsonwebtoken';
import { TokenGenerator } from '@/data/protocols';
import { User } from '@/domain/entities';

type JwtAdapterParams = {
  secret: string
}

export class JwtAdapter implements TokenGenerator {
  private readonly secret: string;

  constructor(params: JwtAdapterParams) {
    Object.assign(this, params);
  }

  async generate(user: User): Promise<string> {
    const token = await jwt.sign({ id: user.id }, this.secret);
    return token;
  }
}
