import { Router } from 'express';

import registerPet from './registerPet';

export default (router: Router): void => {
  registerPet(router);
};
