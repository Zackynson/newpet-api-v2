import { ICreateUserUseCase, CreateUserUseCaseParams } from '@/domain/useCases/User';
import { User } from '@/domain/entities';
import { Encrypter } from '@/data/protocols/Encrypter';
import { CreateUserRepository, FindUserByEmailRepository } from '@/data/protocols/Users';
import { UserAlreadyExistsError } from '@/presentation/errors/UserAlreadyExistsError';

export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    private readonly createUserRepository: CreateUserRepository,
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly encriptionHelper: Encrypter,
  ) {}

  async execute(user: CreateUserUseCaseParams):Promise<User> {
    const userExists = await this.findUserByEmailRepository.findByEmail(user.email);

    if (userExists?.id) throw new UserAlreadyExistsError();

    const encryptedPassword = await this.encriptionHelper.encrypt(user.password);
    const newUser = { ...user, password: encryptedPassword, pets: [] };

    return this.createUserRepository.insert(newUser);
  }
}
