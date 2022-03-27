import { Request, Response } from 'express';
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';

export const adapt = (controller: Controller) => async (req:Request, res:Response) => {
  const httpRequest: HttpRequest<any> = {
    body: req.body,
  };

  const httpResponse:HttpResponse = await controller.handle(httpRequest);

  const { statusCode, ...rest } = httpResponse;

  return res.status(statusCode).json({ ...rest });
};
