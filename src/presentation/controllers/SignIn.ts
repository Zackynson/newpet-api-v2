import {
  Controller,
  HttpRequest,
  HttpResponse,
  EmailValidator,
  PasswordValidator,
} from '@/presentation/protocols';
import {
  badRequest, ok, serverError, notFound,
} from '@/presentation/helpers';
import { MissingParamError, InvalidParamError } from '@/presentation/errors';
import { IFindUserByEmailUseCase } from '@/domain/useCases/User';
import { Decrypter } from '@/data/protocols';

type SignUpControllerConstructor = {
    emailValidator: EmailValidator;
    passwordValidator: PasswordValidator;
    findUserByEmailUseCase: IFindUserByEmailUseCase;
    decrypter: Decrypter;
}
export class SignInController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly passwordValidator: PasswordValidator;
  private readonly findUserByEmailUseCase: IFindUserByEmailUseCase;
  private readonly decrypter: Decrypter;

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

      const user = await this.findUserByEmailUseCase.execute(email);
      if (!user) return notFound(new Error('User not found'));

      const passwordMatch = await this.decrypter.compare(user.password, password);
      if (!passwordMatch) return notFound(new Error('User not found'));

      return ok();
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
