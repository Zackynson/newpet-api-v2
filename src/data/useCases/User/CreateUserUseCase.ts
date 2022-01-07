import { UsersRepository } from '@/data/protocols';
import { ICreateUserUseCase, CreateUserUseCaseParams } from '@/domain/useCases/User';
import { User } from '@/domain/entities';
import { Encrypter } from '@/data/protocols/Encrypter';

export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly encriptionHelper: Encrypter,
  ) {}

  async execute(user: CreateUserUseCaseParams):Promise<User> {
    const userExists = await this.usersRepository.findByEmail(user.email);

    if (userExists) throw new Error('User already exists');
    if (user.password.trim().length < 8) throw new Error('Password should have at least 8 chars');

    const encryptedPassword = await this.encriptionHelper.encrypt(user.password);
    const newUser = { ...user, password: encryptedPassword, pets: [] };

    return this.usersRepository.insert(newUser);
  }
}
