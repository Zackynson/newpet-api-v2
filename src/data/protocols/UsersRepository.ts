import { User } from '@/domain/entities';

export type CreateUserParams = {
  name:string,
  email:string,
  password:string,
  avatarUrl?:string,
  pets?: string[]
}

export type UpdateUserParams = {
  name?:string,
  email?:string,
  avatarUrl?:string,
  password?:string,
  pets?: string[]
}
export interface UsersRepository {
  insert(user: CreateUserParams): Promise<User>
  list(): Promise<User[] | undefined>
  findById(id: string): Promise<User | undefined>
  findByEmail(email: string): Promise<User | undefined>
  delete(id: string): Promise<void>
  update({ id, data }: { id: string, data: UpdateUserParams }): Promise<void>
}
