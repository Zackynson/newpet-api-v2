import { Router, Express } from 'express';
import publicRoutes from '../routes/public';

export default (app: Express): void => {
  const router = Router();
  app.use('/', router);
  publicRoutes(router);
};
