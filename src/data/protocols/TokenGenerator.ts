import { User } from '@/domain/entities';

export interface TokenGenerator {
  generate(user: User): Promise<string>
}
