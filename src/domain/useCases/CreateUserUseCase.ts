import { UsersRepository } from "@/domain/repositories";
import { User } from "../entities/User";

export class CreateUserUseCase{
  constructor(private readonly usersRepository: UsersRepository){
    
  }

  async execute(user: User):Promise<void> {
    return this.usersRepository.insert(user)
  };
}