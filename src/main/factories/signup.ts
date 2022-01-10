/* eslint-disable max-len */
import { CreateUserUseCase } from '@/data/useCases/User';
import { SignUpController } from '@/presentation/controllers/SignUp';
import { EmailValidatorAdapter, PasswordValidatorAdapter } from '@/utils';
import { MongoUsersRepository } from '@/infra/db/mongodb/Users/MongoUsersRepository';
import { BcryptAdapter } from '@/infra/cryptography/BcryptAdapter';
import env from '@/main/config/env';

export const makeSignUpController = (): SignUpController => {
  const emailValidator = new EmailValidatorAdapter();
  const passwordValidator = new PasswordValidatorAdapter();
  const encryptionHelper = new BcryptAdapter(env.bcryptSaltNumber);
  const mongoUsersRepository = new MongoUsersRepository();
  const createUserUseCase = new CreateUserUseCase(mongoUsersRepository, mongoUsersRepository, encryptionHelper);
  return new SignUpController(emailValidator, passwordValidator, createUserUseCase);
};
