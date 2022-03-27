import { Router, Express } from 'express';
import publicRoutes from '../routes/public';
import privateRoutes from '../routes/private';

export default (app: Express): void => {
  const router = Router();
  app.use('/', router);
  publicRoutes(router);
  privateRoutes(router);
};
