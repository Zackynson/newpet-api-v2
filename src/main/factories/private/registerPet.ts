/* eslint-disable max-len */
import { RegisterPetUseCase } from '@/data/useCases/Pets/RegisterPetUseCase';
import { MongoPetsRepository } from '@/infra/db/mongodb/Pets/MongoPetsRepository';
import { MongoUsersRepository } from '@/infra/db/mongodb/Users/MongoUsersRepository';

import { RegisterPetController } from '@/presentation/controllers/pets/RegisterPetController';
import { makeRegisterPetValidator } from './registerPetValidator';

export const makeRegisterPetController = (): RegisterPetController => {
  const registerPetRepository = new MongoPetsRepository();
  const updateUserPetsRepository = new MongoUsersRepository();

  const registerPetUseCase = new RegisterPetUseCase({
    registerPetRepository,
    updateUserPetsRepository,
  });

  const validator = makeRegisterPetValidator();

  return new RegisterPetController({ registerPetUseCase, validator });
};
