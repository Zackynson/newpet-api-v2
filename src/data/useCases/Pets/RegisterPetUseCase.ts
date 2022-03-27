import { RegisterPetRepository } from '@/data/protocols/Pets/RegisterPetRepository';
import { UpdateUserPetsRepository } from '@/data/protocols/Users';
import { RegisterPet, RegisterPetDTO } from '@/domain/useCases/Pets/RegisterPet';

export class RegisterPetUseCase implements RegisterPet {
  private readonly updateUserPetsRepository: UpdateUserPetsRepository;
  private readonly registerPetRepository: RegisterPetRepository;

  constructor(params: RegisterPetUseCase.Params) {
    Object.assign(this, params);
  }

  async register(params: RegisterPetDTO): Promise<void> {
    const pet = await this.registerPetRepository.register(params);

    return this.updateUserPetsRepository.addPet({
      petId: pet.id,
      userId: params.ownerId,
    });
  }
}

export namespace RegisterPetUseCase {

  export type Params = {
    registerPetRepository: RegisterPetRepository
    updateUserPetsRepository: UpdateUserPetsRepository
  }
}
