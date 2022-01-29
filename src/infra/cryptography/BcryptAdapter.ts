import bcrypt from 'bcrypt';
import { Encrypter } from '@/data/protocols/Encrypter';
import { Decrypter } from '@/data/protocols';

export class BcryptAdapter implements Encrypter, Decrypter {
  constructor(private readonly salt: number) {}

  async encrypt(text: string): Promise<string> {
    return bcrypt.hash(text, this.salt);
  }

  async compare(hash: string, plainText: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
