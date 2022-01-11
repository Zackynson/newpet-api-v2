import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
  PasswordValidator,
} from '@/presentation/protocols';
import { badRequest, ok, serverError } from '@/presentation/helpers';
import { MissingParamError, InvalidParamError } from '@/presentation/errors';

type SignUpControllerConstructor = {
    emailValidator: EmailValidator;
    passwordValidator: PasswordValidator;
}
export class SignInController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly passwordValidator: PasswordValidator;

  constructor(params: SignUpControllerConstructor) {
    Object.assign(this, params);
  }

  async handle(httpRequest:HttpRequest):Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body;

      if (!email) return badRequest(new MissingParamError('email'));
      if (!password) return badRequest(new MissingParamError('password'));

      const isEmailValid = this.emailValidator.validate(email);
      if (!isEmailValid) return badRequest(new InvalidParamError('email'));

      const isPasswordValid = this.passwordValidator.validate(password);
      if (!isPasswordValid) return badRequest(new InvalidParamError('password'));

      return ok();
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
