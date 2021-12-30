import { Pet } from '@/domain/entities';

export interface IFindPetByIdUseCase {
  execute(id:string):Promise<Pet | undefined>
}
