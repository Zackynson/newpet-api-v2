import { User } from '@/domain/entities/User';

export interface IFindUserByEmailUseCase {
   execute(email: string):Promise<User>
}
