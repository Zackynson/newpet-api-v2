export type UpdateUserDTO = {
  name?:string,
  email?:string,
  avatarUrl?:string,
  oldPassword?:string,
  password?:string,
  confirmPassword?:string,
}

export interface IUpdateUserUseCase {
  execute(id: string, data: UpdateUserDTO):Promise<void>
}
