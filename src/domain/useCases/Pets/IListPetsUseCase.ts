import { Pet } from '@/domain/entities';

export interface IListPetsUseCase {
  execute():Promise<Pet[]>
}
