import { Pet } from '@/domain/entities';
import { PetsRepository } from '@/domain/repositories/PetsRepository';

export class MemoryPetsRepository implements PetsRepository {
  readonly pets:Pet[];

  constructor() {
    this.pets = [];
  }

  async insert(pet: Pet): Promise<Pet> {
    const id = (this.pets.length + 1).toString();
    const newPet = { id, ...pet };

    this.pets.push(newPet);

    return newPet;
  }
}
