import { Router, Express } from 'express';
import signup from '../routes/signup';

export default (app: Express): void => {
  const router = Router();
  app.use('/', router);
  signup(router);
};
