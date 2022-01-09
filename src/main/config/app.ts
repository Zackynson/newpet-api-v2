import express from 'express';
import setUpMiddlewares from '@/main/config/middlewares';

const app = express();
setUpMiddlewares(app);

export default app;
