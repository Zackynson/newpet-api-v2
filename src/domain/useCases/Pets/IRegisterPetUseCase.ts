import { Pet } from '@/domain/entities';

export interface IRegisterPetUseCase {
  execute(pet:Pet):Promise<Pet>
}
