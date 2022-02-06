import { HttpRequest, HttpResponse, Middleware } from '@/presentation/protocols';
import { AccessDeniedError } from '@/presentation/errors';
import { forbidden } from '@/presentation/helpers';

export class AuthMiddleware implements Middleware {
  async handle(_httpRequest: HttpRequest): Promise<HttpResponse> {
    return forbidden(new AccessDeniedError());
  }
}
