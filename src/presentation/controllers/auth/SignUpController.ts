import {
  ok,
  badRequest,
  serverError,
  forbidden,
} from '@/presentation/helpers';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/Http';
import {
  Controller,
  EmailValidator,
  PasswordValidator,
  Validator,
} from '@/presentation/protocols';
import { InvalidParamError, UserAlreadyExistsError } from '@/presentation/errors';
import { ICreateUserUseCase } from '@/domain/useCases/User';

type SignUpControllerConstructor = {
  emailValidator: EmailValidator;
  passwordValidator: PasswordValidator;
  validator: Validator;
  createUserUseCase: ICreateUserUseCase;
}
export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly passwordValidator: PasswordValidator;
  private readonly createUserUseCase: ICreateUserUseCase;
  private readonly validator: Validator;

  constructor(params: SignUpControllerConstructor) {
    Object.assign(this, params);
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const haserror = await this.validator.validate(httpRequest.body);
      if (haserror) return badRequest(haserror);

      const {
        name, email, password, confirmPassword, avatarUrl,
      } = httpRequest.body || {};

      if (confirmPassword !== password) return badRequest(new InvalidParamError('confirmPassword'));

      const emailIsValid = this.emailValidator.validate(email);
      if (!emailIsValid) return badRequest(new InvalidParamError('email'));

      const passwordIsValid = this.passwordValidator.validate(password);
      if (!passwordIsValid) return badRequest(new InvalidParamError('password'));

      const user = await this.createUserUseCase.execute({
        name, email, password, avatarUrl,
      });

      return ok(user);
    } catch (error) {
      console.error(error);
      if (error instanceof UserAlreadyExistsError) return forbidden(error);
      return serverError();
    }
  }
}
