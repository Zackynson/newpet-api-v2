import { UsersRepository, PetsRepository } from '@/data/protocols';
import { IDeletePetUseCase } from '@/domain/useCases/Pets';

export class DeletePetUseCase implements IDeletePetUseCase {
  constructor(private readonly petsRepository: PetsRepository,
    private readonly usersRepository: UsersRepository) {}

  async execute(petId:string, ownerId:string):Promise<void> {
    const user = await this.usersRepository.findById(ownerId);
    if (!user) throw new Error('User not found');

    const foundPet = await this.petsRepository.findByid(petId);
    if (!foundPet) throw new Error('Pet not found');

    const petIsRegisteredByUser = user.pets.includes(petId);
    if (!petIsRegisteredByUser) throw new Error('Pet not found on users account');

    await this.petsRepository.delete(petId);
    await this.usersRepository.update({
      id: ownerId,
      data: {
        pets: user.pets.filter((p) => p !== petId),
      },
    });
  }
}
