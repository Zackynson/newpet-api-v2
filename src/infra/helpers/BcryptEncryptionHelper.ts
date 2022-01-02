import bcrypt from 'bcrypt';
import { EncryptionHelper } from '@/domain/helpers/EncryptionHelper';

export class BcryptEncryptionHelper implements EncryptionHelper {
  private readonly NUMBER_OF_SALTS = 8;

  async encrypt(text: string): Promise<string> {
    return bcrypt.hash(text, this.NUMBER_OF_SALTS);
  }

  async compare(text: string, hash: string): Promise<boolean> {
    return bcrypt.compare(text, hash);
  }
}
