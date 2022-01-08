import { User } from '@/domain/entities';

export type CreateUserParams = {
  avatarUrl?: string;
  email: string;
  password: string;
  name: string;
}

export interface CreateUserRepository{
 insert(user: CreateUserParams): Promise<User>
}
