import { User } from '@/domain/entities';

export type CreateUserUseCaseParams = {
  avatarUrl?: string;
  email: string;
  password: string;
  name: string;
}
export interface ICreateUserUseCase {
  execute(user: CreateUserUseCaseParams):Promise<User>
}
