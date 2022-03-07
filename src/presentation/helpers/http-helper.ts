import { HttpResponse } from '@/presentation/protocols';
import { ServerError, UnauthorizedError } from '@/presentation/errors';

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  data: error,
});

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  data: new UnauthorizedError(),
});

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  data: error,
});

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  data: new ServerError(),
});

export const ok = (data?: any): HttpResponse => ({
  statusCode: 200,
  data,
});
