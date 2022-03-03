import { HttpRequest, HttpResponse, Middleware } from '@/presentation/protocols';
import { AccessDeniedError } from '@/presentation/errors';
import { forbidden } from '@/presentation/helpers';
import { LoadUserByToken } from '@/domain/useCases/User/LoadUserByToken';

export class AuthMiddleware implements Middleware {
  private readonly loadUserByToken: LoadUserByToken;

  constructor(params: AuthMiddleware.Params) {
    Object.assign(this, params);
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpRequest?.headers?.['x-access-token'];
    if (accessToken) {
      await this.loadUserByToken.load(accessToken);
    }

    return forbidden(new AccessDeniedError());
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace AuthMiddleware {
  export type Params = {
    loadUserByToken: LoadUserByToken
  }
}
