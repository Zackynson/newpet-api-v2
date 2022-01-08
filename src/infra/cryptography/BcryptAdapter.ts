import bcrypt from 'bcrypt';
import { Encrypter } from '@/data/protocols/Encrypter';

export class BcryptAdapter implements Encrypter {
  constructor(private readonly salt: number) {}

  async encrypt(text: string): Promise<string> {
    return bcrypt.hash(text, this.salt);
  }
}
