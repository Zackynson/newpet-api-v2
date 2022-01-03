import { UpdateUserParams, UsersRepository } from '@/infra/protocols';
import { EncryptionHelper } from '@/domain/helpers/EncryptionHelper';
import { IUpdateUserUseCase, UpdateUserDTO } from '@/domain/useCases/User';

export class UpdateUserUseCase implements IUpdateUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly encriptionHelper: EncryptionHelper,
  ) {}

  async execute(id: string, data: UpdateUserDTO):Promise<void> {
    const foundUser = await this.usersRepository.findById(id);
    if (!foundUser) throw new Error('User not found');

    const {
      oldPassword, password, confirmPassword, ...rest
    } = data;

    const updateData: UpdateUserParams = {
      ...rest,
    };

    if (password) {
      if (password.trim().length < 8) throw new Error('password should have at least 8 chars');
      if (!oldPassword) throw new Error('oldPassword not informed');
      if (!confirmPassword) throw new Error('confirmPassword not informed');
      if (password !== confirmPassword) throw new Error('password and confirmPassword does not match');

      // eslint-disable-next-line max-len
      const oldPasswordIsValid = await this.encriptionHelper.compare(oldPassword, foundUser.password);
      if (!oldPasswordIsValid) throw new Error('oldPassword is invalid');

      updateData.password = await this.encriptionHelper.encrypt(password);
    }

    return this.usersRepository.update({ id, data: updateData });
  }
}
