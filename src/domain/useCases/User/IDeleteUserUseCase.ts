import { User } from '@/domain/entities/User';

export interface IDeleteUserUseCase {
   execute(id: string):Promise<void>
}
