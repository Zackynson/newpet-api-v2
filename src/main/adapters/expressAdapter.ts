import { Request, Response } from 'express';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';

export const adapt = (controller: Controller) => async (req:Request, res:Response) => {
  const expressRequest = req as any;

  const httpRequest: HttpRequest<any> = {
    body: expressRequest.body,
    userId: expressRequest?.userId,
  };

  const httpResponse:HttpResponse = await controller.handle(httpRequest);

  const { statusCode, ...rest } = httpResponse;

  return res.status(statusCode).json({ ...rest });
};
