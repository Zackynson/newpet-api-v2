import { Pet } from '@/domain/entities';
import { UsersRepository } from '@/domain/repositories';
import { PetsRepository } from '@/domain/repositories/PetsRepository';
import { IRegisterPetUseCase } from '@/domain/useCases';

export class RegisterPetUseCase implements IRegisterPetUseCase {
  constructor(private readonly petsRepository: PetsRepository,
    private readonly usersRepository: UsersRepository) {}

  async execute(pet: Pet):Promise<Pet> {
    const user = await this.usersRepository.findById(pet.ownerId);
    if (!user) throw new Error('User not found');

    const registeredPet = await this.petsRepository.insert(pet);

    const userUpdateData = {
      pets: user.pets ? user.pets.concat(registeredPet.id) : [registeredPet.id],
    };

    await this.usersRepository.update({ id: user.id, data: userUpdateData });

    return registeredPet;
  }
}
