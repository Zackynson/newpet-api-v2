import { Pet } from '@/domain/entities';
import { PetsRepository } from '@/domain/repositories/PetsRepository';

export class MemoryPetsRepository implements PetsRepository {
  readonly pets:Pet[];

  constructor() {
    this.pets = [];
  }

  async insert(pet: Pet): Promise<void> {
    this.pets.push(pet);
  }
}
