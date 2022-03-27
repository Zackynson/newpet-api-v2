import { HttpRequest, HttpResponse } from '@/presentation/protocols';

export interface Middleware {
  handle(httpRequest: HttpRequest<any>): Promise<HttpResponse>;
}
