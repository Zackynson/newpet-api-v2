import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
  PasswordValidator,
} from '@/presentation/protocols';
import { badRequest, ok } from '@/presentation/helpers';
import { MissingParamError, InvalidParamError } from '@/presentation/errors';

export class SignInController implements Controller {
  constructor(private readonly emailValidator: EmailValidator,
    private readonly passwordValidator: PasswordValidator) {}

  async handle(httpRequest:HttpRequest):Promise<HttpResponse> {
    const { email, password } = httpRequest.body;

    if (!email) return badRequest(new MissingParamError('email'));
    if (!password) return badRequest(new MissingParamError('password'));

    const isEmailValid = this.emailValidator.validate(email);
    if (!isEmailValid) return badRequest(new InvalidParamError('email'));

    const isPasswordValid = this.passwordValidator.validate(password);
    if (!isPasswordValid) return badRequest(new InvalidParamError('password'));

    return ok();
  }
}
