import { Pet } from '../entities';

export type UpdatePetParams = {
  name?: string;
  age?: number;
  category?: 'cat' | 'dog' | 'bird' | 'other';
  pictures?: string[]
}
export interface PetsRepository {
  insert(pet: Pet): Promise<Pet>
  findByid(id: string): Promise<Pet | undefined>
  update(id: string, data: UpdatePetParams): Promise<Pet | undefined>
  delete(id: string): Promise<void>
  list():Promise<Pet[]>
}
