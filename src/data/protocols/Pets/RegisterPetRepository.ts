import { Pet } from '@/domain/entities';

export type RegisterPetData = {
  name: string;
  age: number;
  category: 'cat' | 'dog' | 'bird' | 'other';
  ownerId: string;
  pictures?: string[]
}

export interface RegisterPetRepository{
  register(params: RegisterPetData):Promise<Pet>
}
