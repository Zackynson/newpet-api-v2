import { Router } from 'express';
import { adapt } from '@/main/adapters/expressAdapter';
import { adaptMiddleware } from '@/main/adapters/expressMiddlewareAdapter';
import { makeAuthMiddleware } from '@/main/factories/authMiddleware';
import { makeRegisterPetController } from '@/main/factories/private/registerPet';

export default (router: Router): void => {
  router.post('/pets', adaptMiddleware(makeAuthMiddleware()), adapt(makeRegisterPetController()));
};
