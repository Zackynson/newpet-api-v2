import { Pet } from '@/domain/entities';
import { PetsRepository } from '@/domain/repositories/PetsRepository';
import { IRegisterPetUseCase } from '@/domain/useCases';

export class RegisterPetUseCase implements IRegisterPetUseCase {
  constructor(private readonly petsRepository: PetsRepository) {}

  async execute(pet: Pet):Promise<void> {
    return this.petsRepository.insert(pet);
  }
}
