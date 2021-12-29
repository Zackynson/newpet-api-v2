import { Pet } from '../entities';

export interface PetsRepository {
  insert(pet: Pet): Promise<Pet>
}
