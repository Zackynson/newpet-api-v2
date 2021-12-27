import { User } from '../entities/User';

export type UpdateUserDTO = {
  id: string,
  data: {
    name?: string;
    avatarUrl?: string;
    password?: string;
    oldPassword?: string;
    confirmPassword?: string;
  }
}
export interface UsersRepository {
  insert(user: User): Promise<void>
  list(): Promise<User[] | undefined>
  findById(id: string): Promise<User | undefined>
  findByEmail(email: string): Promise<User | undefined>
  delete(id: string): Promise<void>
  update({ id, data }: UpdateUserDTO): Promise<void>
}
