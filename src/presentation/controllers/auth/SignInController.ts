/* eslint-disable no-unreachable-loop */
/* eslint-disable no-restricted-syntax */
import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
  PasswordValidator,
} from '@/presentation/protocols';

import {
  badRequest,
  ok,
  serverError,
  unauthorized,
} from '@/presentation/helpers';

import { MissingParamError, InvalidParamError } from '@/presentation/errors';
import { Authentication } from '@/domain/useCases/Auth';

type SignUpControllerConstructor = {
    emailValidator: EmailValidator;
    passwordValidator: PasswordValidator;
    authenticationUseCase: Authentication;
}

type BodyParams = {
  email?:string,
  password?:string
}
export class SignInController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly passwordValidator: PasswordValidator;
  private readonly authenticationUseCase: Authentication;

  constructor(params: SignUpControllerConstructor) {
    Object.assign(this, params);
  }

  async handle(httpRequest:HttpRequest<BodyParams>):Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password'];

      for (const field of requiredFields) {
        if (!httpRequest.body?.[field]) {
          return badRequest(new MissingParamError(field));
        }
      }

      const { email, password } = httpRequest.body;

      const isEmailValid = this.emailValidator.validate(email);
      if (!isEmailValid) return badRequest(new InvalidParamError('email'));

      const isPasswordValid = this.passwordValidator.validate(password);
      if (!isPasswordValid) return badRequest(new InvalidParamError('password'));

      const accessToken = await this.authenticationUseCase.auth(email, password);
      if (!accessToken) return unauthorized();

      return ok({
        access_token: accessToken,
      });
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
