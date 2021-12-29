import { User } from '../entities/User';

export type UpdateUserParams = {
  name?:string,
  email?:string,
  avatarUrl?:string,
  password?:string,
  pets?: string[]
}
export interface UsersRepository {
  insert(user: User): Promise<void>
  list(): Promise<User[] | undefined>
  findById(id: string): Promise<User | undefined>
  findByEmail(email: string): Promise<User | undefined>
  delete(id: string): Promise<void>
  update({ id, data }: { id: string, data: UpdateUserParams }): Promise<void>
}
