import { Pet } from '@/domain/entities';
import { PetsRepository, UpdatePetParams } from '@/domain/repositories/PetsRepository';

export class MemoryPetsRepository implements PetsRepository {
  readonly pets:Pet[];

  constructor() {
    this.pets = [];
  }

  async delete(id: string): Promise<void> {
    const userIndex = this.pets.findIndex((p) => p.id === id);
    this.pets.splice(userIndex, 1);
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

    const updatedPet:Pet = {
      ...foundPet,
      ...data,
    };

    this.pets.splice(this.pets.findIndex((p) => p.id === id), 1);
    this.pets.push(updatedPet);

    return updatedPet;
  }

  async mockPetsList(): Promise<void> {
    const petsList:Pet[] = [{
      id: '1',
      name: 'pet_1',
      age: 1,
      category: 'cat',
      ownerId: '1',
      pictures: [
        'pic_1.jpeg',
        'pic_2.jpeg',
        'pic_3.jpeg',
      ],
    },
    {
      id: '2',
      name: 'pet_2',
      age: 2,
      category: 'dog',
      ownerId: '2',
      pictures: [
        'pic_4.jpeg',
        'pic_5.jpeg',
        'pic_6.jpeg',
      ],
    }, {
      id: '3',
      name: 'pet_3',
      age: 3,
      category: 'bird',
      ownerId: '3',
      pictures: [
        'pic_7.jpeg',
        'pic_8.jpeg',
        'pic_9.jpeg',
      ],
    }];

    this.pets.push(...petsList);
  }

  async list():Promise<Pet[]> {
    return this.pets;
  }
}
