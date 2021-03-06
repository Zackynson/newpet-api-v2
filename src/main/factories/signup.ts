/* eslint-disable max-len */
import { CreateUserUseCase } from '@/data/useCases/User';
import { SignUpController } from '@/presentation/controllers/auth';
import { MongoUsersRepository } from '@/infra/db/mongodb/Users/MongoUsersRepository';
import { BcryptAdapter } from '@/infra/cryptography/BcryptAdapter';
import env from '@/main/config/env';

import { makeSignUpValidator } from '@/main/factories/signupValidator';

export const makeSignUpController = (): SignUpController => {
  const encryptionHelper = new BcryptAdapter(env.bcryptSaltNumber);
  const mongoUsersRepository = new MongoUsersRepository();
  const createUserUseCase = new CreateUserUseCase({ createUserRepository: mongoUsersRepository, findUserByEmailRepository: mongoUsersRepository, encryptionHelper });
  return new SignUpController({
    createUserUseCase, validator: makeSignUpValidator(),
  });
};
