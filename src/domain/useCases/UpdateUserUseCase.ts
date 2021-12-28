import { UsersRepository } from '@/domain/repositories';
import { User } from '@/domain/entities/User';
import { EncryptionHelper } from '@/domain/helpers/EncryptionHelper';

type UpdateUserDTO = {

  name?:string,
  email?:string,
  avatarUrl?:string,
  oldPassword?:string,
  password?:string,
  confirmPassword?:string,
}

export class UpdateUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly encriptionHelper: EncryptionHelper,
  ) {}

  async execute(id: string, data: UpdateUserDTO):Promise<void> {
    const foundUser = await this.usersRepository.findById(id);
    if (!foundUser) throw new Error('User not found');

    const updateUser: User = { ...foundUser };

    if (data.name) updateUser.name = data.name;
    if (data.email) updateUser.email = data.email;
    if (data.avatarUrl) updateUser.avatarUrl = data.avatarUrl;

    if (data.password) {
      if (data.password.trim().length < 8) throw new Error('password should have at least 8 chars');
      if (!data.oldPassword) throw new Error('oldPassword not informed');
      if (!data.confirmPassword) throw new Error('confirmPassword not informed');
      if (data.password !== data.confirmPassword) throw new Error('password and confirmPassword does not match');

      // eslint-disable-next-line max-len
      const oldPasswordIsValid = await this.encriptionHelper.compare(data.oldPassword, foundUser.password);
      if (!oldPasswordIsValid) throw new Error('oldPassword is invalid');

      updateUser.password = await this.encriptionHelper.encrypt(data.password);
    }

    return this.usersRepository.update({ id, user: updateUser });
  }
}
