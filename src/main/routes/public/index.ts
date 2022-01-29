import { Router } from 'express';

import signIn from './signIn';
import signup from './signup';

export default (router: Router): void => {
  signup(router);
  signIn(router);
};
