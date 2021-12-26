import { User } from "@/domain/entities/User";
import { UsersRepository } from "@/domain/repositories/UsersRepository";

export class UsersRepositoryMock implements UsersRepository {
  users: User[] = []

  async insert(newUser: User): Promise<void> {
    if(this.users.some(u => u.email === newUser.email)) throw new Error('User already exists') 
    this.users.push(newUser)
  }
  
  async list(): Promise<User[]> {
    return this.users;
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id)
  }

  async delete(id: string): Promise<void> {
    const userIndex = this.users.findIndex(u => u.id === id)
    if(userIndex < 0) throw new Error('User not found');
    this.users.splice(userIndex, 1)
  }
}