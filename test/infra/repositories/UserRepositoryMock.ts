import { User } from '@/domain/entities/User';
import { UpdateUserDTO, UsersRepository } from '@/domain/repositories/UsersRepository';

export class UsersRepositoryMock implements UsersRepository {
  users: User[] = []

  async insert(newUser: User): Promise<void> {
    this.users.push(newUser);
  }

  async list(): Promise<User[]> {
    return this.users;
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find((u) => u.id === id);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email === email);
  }

  async delete(id: string): Promise<void> {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex < 0) throw new Error('User not found');
    this.users.splice(userIndex, 1);
  }

  async update({ id, data }: UpdateUserDTO): Promise<void> {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex < 0) throw new Error('User not found');

    const updatedUser = { ...this.users[userIndex], ...data };

    this.users.splice(userIndex, 1);
    this.users.push(updatedUser);
  }
}
