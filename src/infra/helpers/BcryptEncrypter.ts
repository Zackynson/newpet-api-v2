import bcrypt from 'bcrypt';
import { Encrypter } from '@/data/protocols/Encrypter';

export class BcryptEncrypter implements Encrypter {
  private readonly NUMBER_OF_SALTS = 8;

  async encrypt(text: string): Promise<string> {
    return bcrypt.hash(text, this.NUMBER_OF_SALTS);
  }

  async compare(text: string, hash: string): Promise<boolean> {
    return bcrypt.compare(text, hash);
  }
}
