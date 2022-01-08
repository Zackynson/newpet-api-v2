import bcrypt from 'bcrypt';
import { Encrypter } from '@/data/protocols/Encrypter';

export class BcryptAdapter implements Encrypter {
  constructor(private readonly salt: number) {}

  async encrypt(text: string): Promise<string> {
    return bcrypt.hash(text, this.salt);
  }

  async compare(text: string, hash: string): Promise<boolean> {
    return bcrypt.compare(text, hash);
  }
}
