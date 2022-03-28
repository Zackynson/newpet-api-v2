import { NextFunction, Request, Response } from 'express';
import { HttpRequest, HttpResponse, Middleware } from '@/presentation/protocols';

export const adaptMiddleware = (middleware: Middleware) => async (
  req:Request, res:Response, next: NextFunction,
) => {
  const httpRequest: HttpRequest<any> = {
    headers: req.headers,
  };

  const authResponse: HttpResponse = await middleware.handle(httpRequest);
  const { statusCode, ...rest } = authResponse;

  if (statusCode === 200) {
    Object.assign(req, { userId: authResponse.data.userId });

    return next();
  }

  return res.status(statusCode).json({ ...rest });
};
