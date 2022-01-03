import { Pet } from '@/domain/entities';
import { UpdatePetParams } from '@/infra/protocols/PetsRepository';

export type UpdatePetDTO = { petId: string, ownerId: string, data: UpdatePetParams }

export interface IUpdatePetUseCase {
  execute({ petId, ownerId, data }: UpdatePetDTO):Promise<Pet>
}
