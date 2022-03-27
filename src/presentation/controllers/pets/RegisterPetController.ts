import { RegisterPet } from '@/domain/useCases/Pets/RegisterPet';
import { badRequest, ok, serverError } from '@/presentation/helpers';
import {
  Controller, HttpRequest, HttpResponse, Validator,
} from '@/presentation/protocols';

export type BodyParams = {
  name: string;
  age: number;
  category: 'cat' | 'dog' | 'bird' | 'other';
  pictures?: string[]
}

export class RegisterPetController implements Controller {
  private readonly validator:Validator;
  private readonly registerPetUseCase: RegisterPet;

  constructor(params:RegisterPetController.Params) {
    Object.assign(this, params);
  }

  async handle(httpRequest: HttpRequest<BodyParams>): Promise<HttpResponse> {
    try {
      const error = await this.validator.validate(httpRequest);
      if (error) {
        return badRequest(error);
      }

      await this.registerPetUseCase.register({ ...httpRequest.body, ownerId: httpRequest.userId });

      return ok({
        message: 'Pet registrado com sucesso',
      });
    } catch (error) {
      console.log(error);
      return serverError();
    }
  }
}

export namespace RegisterPetController {
  export type Params = {
    registerPetUseCase: RegisterPet;
    validator:Validator;
  }
}
