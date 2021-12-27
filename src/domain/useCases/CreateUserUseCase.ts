import { UsersRepository } from '@/domain/repositories';
import { User } from '@/domain/entities/User';

export class CreateUserUseCase {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(user: User):Promise<void> {
    if (user.password.trim().length < 8) throw new Error('Password should have at least 8 chars');

    const userExists = await this.usersRepository.findByEmail(user.email);
    if (userExists) throw new Error('User already exists');

    return this.usersRepository.insert(user);
  }
}
