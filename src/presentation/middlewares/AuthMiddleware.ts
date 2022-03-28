import { HttpRequest, HttpResponse, Middleware } from '@/presentation/protocols';
import { AccessDeniedError } from '@/presentation/errors';
import { forbidden, ok, serverError } from '@/presentation/helpers';
import { LoadUserByToken } from '@/domain/useCases/User/LoadUserByToken';

export class AuthMiddleware implements Middleware {
  private readonly loadUserByToken: LoadUserByToken;

  constructor(params: AuthMiddleware.Params) {
    Object.assign(this, params);
  }

  async handle(httpRequest: HttpRequest<any>): Promise<HttpResponse> {
    try {
      const accessToken = httpRequest?.headers?.['x-access-token'];
      if (accessToken) {
        const user = await this.loadUserByToken.load(accessToken);

        if (user?.id) {
          return ok({
            userId: user.id,
          });
        }
      }

      return forbidden(new AccessDeniedError());
    } catch (error) {
      return serverError();
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace AuthMiddleware {
  export type Params = {
    loadUserByToken: LoadUserByToken
  }
}
