import { badRequest, ok, serverError } from '@/presentation/helpers';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/Http';
import { Controller, EmailValidator } from '@/presentation/protocols';
import { InvalidParamError, MissingParamError } from '@/presentation/errors';

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const {
        name, email, password, confirmPassword,
      } = httpRequest.body || {};

      if (!name) return badRequest(new MissingParamError('name'));
      if (!email) return badRequest(new MissingParamError('email'));
      if (!password) return badRequest(new MissingParamError('password'));
      if (!confirmPassword) return badRequest(new MissingParamError('confirmPassword'));

      const emailIsValid = this.emailValidator.validate(email);

      if (!emailIsValid) return badRequest(new InvalidParamError('email'));

      return ok();
    } catch (error) {
      return serverError();
    }
  }
}
