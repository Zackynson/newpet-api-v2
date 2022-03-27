/* eslint-disable max-len */
import env from '@/main/config/env';

import { AuthMiddleware } from '@/presentation/middlewares';
import { LoadUserByTokenUseCase } from '@/data/useCases/User/LoadUserByTokenUseCase';
import { MongoLoadUserByTokenRepository } from '@/infra/db/mongodb/Users/MongoLoadUserByTokenRepository';
import { JwtAdapter } from '@/infra/cryptography';

export const makeAuthMiddleware = (): AuthMiddleware => {
  const tokenDecrypter = new JwtAdapter({
    secret: env.jwtSecret,
  });

  const mongoUsersRepository = new MongoLoadUserByTokenRepository();

  const loadUserByToken = new LoadUserByTokenUseCase({
    loadUserByTokenRepository: mongoUsersRepository,
    tokenDecrypter,
  });

  return new AuthMiddleware({
    loadUserByToken,
  });
};
