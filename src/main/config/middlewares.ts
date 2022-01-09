import { Express } from 'express';
import { bodyParser } from '@/main/middlewares/bodyParser';

export default (app: Express): void => {
  app.use(bodyParser);
};
