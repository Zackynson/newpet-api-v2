import { Pet } from '@/domain/entities';
import { UpdatePetParams } from '@/domain/repositories/PetsRepository';

export type UpdatePetDTO = { petId: string, ownerId: string, data: UpdatePetParams }

export interface IUpdatePetUseCase {
  execute({ petId, ownerId, data }: UpdatePetDTO):Promise<Pet>
}
