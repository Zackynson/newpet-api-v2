import { User } from '@/domain/entities/User';

export interface IFindUserByIdUseCase {
   execute(id: string):Promise<User>
}
