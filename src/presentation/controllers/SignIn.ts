import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';
import { badRequest } from '@/presentation/helpers';
import { MissingParamError } from '@/presentation/errors';

export class SignInController implements Controller {
  async handle(httpRequest:HttpRequest):Promise<HttpResponse> {
    const { email } = httpRequest.body;

    if (!email) return badRequest(new MissingParamError('email'));
    return null;
  }
}
