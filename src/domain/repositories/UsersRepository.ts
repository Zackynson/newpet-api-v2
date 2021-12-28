import { User } from '../entities/User';

export interface UsersRepository {
  insert(user: User): Promise<void>
  list(): Promise<User[] | undefined>
  findById(id: string): Promise<User | undefined>
  findByEmail(email: string): Promise<User | undefined>
  delete(id: string): Promise<void>
  update({ id, user }: {
    id: string,
    user: User
  }): Promise<void>
}
