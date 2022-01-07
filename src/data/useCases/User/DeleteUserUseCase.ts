import { UsersRepository } from '@/data/protocols';
import { IDeleteUserUseCase } from '@/domain/useCases/User';

export class DeleteUserUseCase implements IDeleteUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(id: string):Promise<void> {
    const foundUser = await this.usersRepository.findById(id);
    if (!foundUser) throw new Error('User not found');

    return this.usersRepository.delete(id);
  }
}
