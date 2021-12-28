import { User } from '@/domain/entities/User';

export interface ICreateUserUseCase {
  execute(user: User):Promise<void>
}
