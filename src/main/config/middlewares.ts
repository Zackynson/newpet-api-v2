import { Express } from 'express';
import { bodyParser } from '@/main/middlewares/bodyParser';
import { cors } from '@/main/middlewares/cors';

export default (app: Express): void => {
  app.use(cors);
  app.use(bodyParser);
};
