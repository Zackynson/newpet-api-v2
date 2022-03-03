import { User } from '@/domain/entities';

export interface LoadUserByTokenRepository{
 loadByToken(token: string): Promise<User>
}
