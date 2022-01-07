import { Pet } from '@/domain/entities';
import { UsersRepository, PetsRepository } from '@/data/protocols';
import { IUpdatePetUseCase, UpdatePetDTO } from '@/domain/useCases/Pets';

export class UpdatePetUseCase implements IUpdatePetUseCase {
  constructor(private readonly petsRepository: PetsRepository,
    private readonly usersRepository: UsersRepository) {}

  async execute({ petId, ownerId, data } : UpdatePetDTO):Promise<Pet> {
    const user = await this.usersRepository.findById(ownerId);
    if (!user) throw new Error('User not found');

    const foundPet = await this.petsRepository.findByid(petId);
    if (!foundPet) throw new Error('Pet not found');

    const petIsRegisteredByUser = user.pets.includes(petId);
    if (!petIsRegisteredByUser) throw new Error('Pet not found on users account');

    const updatedPet = await this.petsRepository.update(foundPet.id, data);

    return updatedPet;
  }
}
