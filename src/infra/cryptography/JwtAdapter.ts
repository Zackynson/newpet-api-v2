import jwt from 'jsonwebtoken';
import { TokenDecrypter, TokenGenerator } from '@/data/protocols';
import { User } from '@/domain/entities';

type JwtAdapterParams = {
  secret: string
}

export class JwtAdapter implements TokenGenerator, TokenDecrypter {
  private readonly secret: string;

  constructor(params: JwtAdapterParams) {
    Object.assign(this, params);
  }

  async decrypt(hash: string): Promise<string> {
    return jwt.verify(hash, this.secret) as any;
  }

  async generate(user: User): Promise<string> {
    const token = await jwt.sign({ id: user.id }, this.secret);
    return token;
  }
}