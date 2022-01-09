import { Router } from 'express';
import { makeSignUpController } from '@/main/factories/signup';
import { adapt } from '@/main/adapters/expressAdapter';

export default (router: Router): void => {
  router.post('/signup', adapt(makeSignUpController()));
};
