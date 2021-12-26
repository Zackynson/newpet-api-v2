import { User } from "../entities/User";

export type UpdateUserDTO = {
  id: string,
  data: {
    name?: string; 
    avatar_url?: string;
    password?: string;
    old_password?: string;
    confirm_password?: string;
  }
}
export interface UsersRepository {
  insert(user: User): Promise<void>
  list(): Promise<User[] | undefined>
  findById(id: string): Promise<User | undefined>
  delete(id: string): Promise<void>
  update({id, data}: UpdateUserDTO): Promise<void>
}