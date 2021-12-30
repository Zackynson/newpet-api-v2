import { Pet } from '@/domain/entities';
import { PetsRepository, UpdatePetParams } from '@/domain/repositories/PetsRepository';

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

  async findByid(id: string): Promise<Pet> {
    return this.pets.find((p) => p.id === id);
  }

  async update(id: string, data: UpdatePetParams): Promise<Pet> {
    const foundPet = this.pets.find((p) => p.id === id);

    if (!foundPet) throw new Error('Pet not found');

    const updatedPet:Pet = {
      ...foundPet,
      ...data,
    };

    this.pets.splice(this.pets.findIndex((p) => p.id === id), 1);
    this.pets.push(updatedPet);

    return updatedPet;
  }
}
