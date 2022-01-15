export interface IAuthenticationUseCase{
  auth(email: string, password:string): Promise<string>
}
