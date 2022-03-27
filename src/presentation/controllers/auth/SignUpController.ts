import { ICreateUserUseCase } from '@/domain/useCases/User';
import { UserAlreadyExistsError } from '@/presentation/errors';

import {
  HttpRequest, HttpResponse, Controller, Validator,
} from '@/presentation/protocols';

import {
  ok, badRequest, serverError, forbidden,
} from '@/presentation/helpers';

type SignUpControllerConstructor = {
  validator: Validator;
  createUserUseCase: ICreateUserUseCase;
}

type BodyParams = {
  name?:string,
  email?:string,
  password?:string,
  confirmPassword?:string,
  avatarUrl?:string
}

export class SignUpController implements Controller {
  private readonly createUserUseCase: ICreateUserUseCase;
  private readonly validator: Validator;

  constructor(params: SignUpControllerConstructor) {
    Object.assign(this, params);
  }

  async handle(httpRequest: HttpRequest<BodyParams>): Promise<HttpResponse> {
    try {
      const haserror = await this.validator.validate(httpRequest.body);
      if (haserror) return badRequest(haserror);

      const {
        name, email, password, avatarUrl,
      } = httpRequest.body || {};

      const user = await this.createUserUseCase.execute({
        name,
        email,
        password,
        avatarUrl,
      });

      return ok(user);
    } catch (error) {
      console.error(error);
      if (error instanceof UserAlreadyExistsError) return forbidden(error);
      return serverError();
    }
  }
}
