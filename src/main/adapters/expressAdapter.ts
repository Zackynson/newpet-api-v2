import { Request, Response } from 'express';
import { Controller, HttpRequest } from '@/presentation/protocols';

export const adapt = (controller: Controller) => async (req:Request, res:Response) => {
  const httpRequest: HttpRequest = {
    body: req.body,
  };

  const httpResponse = await controller.handle(httpRequest);

  return res.status(httpResponse.statusCode).json(httpResponse?.data);
};
