import { User } from "../entities/User";

export interface UsersRepository {
  insert(user: User): Promise<void>
  list(): Promise<User[] | undefined>
  findById(id: string): Promise<User | undefined>
  delete(id: string): Promise<void>
}