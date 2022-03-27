import { NextFunction, Request, Response } from 'express';
import { HttpRequest, HttpResponse, Middleware } from '@/presentation/protocols';

export const adaptMiddleware = (middleware: Middleware) => async (
  req:Request, res:Response, next: NextFunction,
) => {
  const httpRequest: HttpRequest<any> = {
    headers: req.headers,
  };

  const httpResponse: HttpResponse = await middleware.handle(httpRequest);

  const { statusCode, ...rest } = httpResponse;

  if (statusCode === 200) {
    Object.assign(httpRequest, httpResponse.data);
    return next();
  }

  return res.status(statusCode).json({ ...rest });
};
