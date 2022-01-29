/* eslint-disable max-len */
import env from '@/main/config/env';

import { SignInController } from '@/presentation/controllers/SignIn';
import { AuthenticationUseCase } from '@/data/useCases/Auth';

import { MongoUsersRepository } from '@/infra/db/mongodb/Users/MongoUsersRepository';
import { JwtAdapter } from '@/infra/token/JwtAdatper';
import { BcryptAdapter } from '@/infra/cryptography/BcryptAdapter';

import { EmailValidatorAdapter, PasswordValidatorAdapter } from '@/utils';

export const makeSignInController = (): SignInController => {
  const emailValidator = new EmailValidatorAdapter();
  const passwordValidator = new PasswordValidatorAdapter();
  const decrypter = new BcryptAdapter(env.bcryptSaltNumber);
  const tokenGenerator = new JwtAdapter({ secret: env.jwtSecret });
  const mongoUsersRepository = new MongoUsersRepository();

  const authenticationUseCase = new AuthenticationUseCase({ decrypter, findUserByEmailRepository: mongoUsersRepository, tokenGenerator });
  return new SignInController({ emailValidator, passwordValidator, authenticationUseCase });
};
