import { HttpResponse } from '@/presentation/protocols';
import { ServerError, UnauthorizedError } from '@/presentation/errors';

const unauthorizedError = new UnauthorizedError();
const internalServerError = new ServerError();

export const badRequest = (error: Error): HttpResponse => ({
  statusCode: 400,
  error: {
    name: error.name,
    message: error.message,
  },
});

export const unauthorized = (): HttpResponse => ({
  statusCode: 401,
  error: {
    name: unauthorizedError.name,
    message: unauthorizedError.message,
  },
});

export const forbidden = (error: Error): HttpResponse => ({
  statusCode: 403,
  error: {
    name: error.name,
    message: error.message,
  },
});

export const serverError = (): HttpResponse => ({
  statusCode: 500,
  error: {
    name: internalServerError.name,
    message: internalServerError.message,
  },
});

export const ok = (data?: any): HttpResponse => ({
  statusCode: 200,
  data,
});
