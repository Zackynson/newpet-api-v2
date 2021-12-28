import { UsersRepository } from '@/domain/repositories';
import { User } from '@/domain/entities/User';
import { EncryptionHelper } from '@/domain/helpers/EncryptionHelper';
import { ICreateUserUseCase } from '@/domain/useCases';

export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly encriptionHelper: EncryptionHelper,
  ) {}

  async execute(user: User):Promise<void> {
    const userExists = await this.usersRepository.findByEmail(user.email);

    if (userExists) throw new Error('User already exists');
    if (user.password.trim().length < 8) throw new Error('Password should have at least 8 chars');

    const encryptedPassword = await this.encriptionHelper.encrypt(user.password);
    const newUser = { ...user, password: encryptedPassword };

    return this.usersRepository.insert(newUser);
  }
}
