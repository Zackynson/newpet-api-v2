import { UsersRepository } from '@/infra/protocols';
import { User } from '@/domain/entities/User';
import { IFindUserByIdUseCase } from '@/domain/useCases/User';

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
