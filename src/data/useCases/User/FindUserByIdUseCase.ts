import { UsersRepository } from '@/domain/repositories';
import { User } from '@/domain/entities/User';
import { IFindUserByIdUseCase } from '@/domain/useCases';

export class FindUserByIdUseCase implements IFindUserByIdUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(id: string):Promise<User> {
    const foundUser = await this.usersRepository.findById(id);
    if (!foundUser) throw new Error('User not found');

    return foundUser;
  }
}
