import { User } from '@/domain/entities';

export interface LoadUserByToken {
  load(accessToken: string):Promise<User>
}
