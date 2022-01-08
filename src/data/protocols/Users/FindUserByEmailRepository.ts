import { User } from '@/domain/entities';

export interface FindUserByEmailRepository{
 find(email: string): Promise<User>
}
