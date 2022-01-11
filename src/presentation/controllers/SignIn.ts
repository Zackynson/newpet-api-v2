import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols';
import { badRequest, ok } from '@/presentation/helpers';
import { MissingParamError } from '@/presentation/errors';

export class SignInController implements Controller {
  async handle(httpRequest:HttpRequest):Promise<HttpResponse> {
    const { email, password } = httpRequest.body;

    if (!email) return badRequest(new MissingParamError('email'));
    if (!password) return badRequest(new MissingParamError('password'));

    return ok();
  }
}
