import { User } from '@/domain/entities/User';
import { UsersRepository, CreateUserParams, UpdateUserParams } from '@/infra/protocols/UsersRepository';

export class MemoryUsersRepository implements UsersRepository {
  users: User[] = [];

  async insert(newUser: CreateUserParams): Promise<void> {
    this.users.push({ id: (this.users.length + 1).toString(), ...newUser });
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

  async update({ id, data }: { id:string, data: UpdateUserParams }): Promise<void> {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex < 0) throw new Error('User not found');

    const updatedUser = { ...this.users[userIndex], ...data };

    this.users.splice(userIndex, 1);
    this.users.push(updatedUser);
  }

  async mockUsersList(): Promise<void> {
    const usersList = [
      {
        id: '1', email: 'email_1', password: 'new_password', name: 'new_user_1', pets: ['1'],
      },
      {
        id: '2', email: 'email_2', password: 'new_password', name: 'new_user_2', pets: ['2'],
      },
      {
        id: '3', email: 'email_3', password: 'new_password', name: 'new_user_3', pets: ['3'],
      },
    ];

    this.users.push(...usersList);
  }
}
