import { UsersRepository } from '@/domain/repositories';
import { PetsRepository } from '@/domain/repositories/PetsRepository';
import { IDeletePetUseCase } from '@/domain/useCases/Pets';

export class DeletePetUseCase implements IDeletePetUseCase {
  constructor(private readonly petsRepository: PetsRepository,
    private readonly usersRepository: UsersRepository) {}

  async execute(petId:string, ownerId:string):Promise<void> {
    const user = await this.usersRepository.findById(ownerId);
    if (!user) throw new Error('User not found');
  }
}
