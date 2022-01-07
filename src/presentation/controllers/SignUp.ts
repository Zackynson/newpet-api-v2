import { badRequest, ok, serverError } from '@/presentation/helpers';
import { HttpRequest, HttpResponse } from '@/presentation/protocols/Http';
import { Controller, EmailValidator } from '@/presentation/protocols';
import { InvalidParamError, MissingParamError } from '@/presentation/errors';
import { ICreateUserUseCase } from '@/domain/useCases/User';

export class SignUpController implements Controller {
  constructor(private readonly emailValidator: EmailValidator,
    private readonly createUserUseCase: ICreateUserUseCase) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const {
        name, email, password, confirmPassword, avatarUrl,
      } = httpRequest.body || {};

      if (!name) return badRequest(new MissingParamError('name'));
      if (!email) return badRequest(new MissingParamError('email'));
      if (!password) return badRequest(new MissingParamError('password'));
      if (!confirmPassword) return badRequest(new MissingParamError('confirmPassword'));

      if (confirmPassword !== password) return badRequest(new InvalidParamError('confirmPassword'));

      const emailIsValid = this.emailValidator.validate(email);

      if (!emailIsValid) return badRequest(new InvalidParamError('email'));

      const user = await this.createUserUseCase.execute({
        name, email, password, avatarUrl,
      });

      return ok(user);
    } catch (error) {
      console.error(error);
      return serverError();
    }
  }
}
