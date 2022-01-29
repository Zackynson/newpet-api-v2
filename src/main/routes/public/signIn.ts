import { Router } from 'express';
import { makeSignInController } from '@/main/factories/signIn';
import { adapt } from '@/main/adapters/expressAdapter';

export default (router: Router): void => {
  router.post('/signin', adapt(makeSignInController()));
};
