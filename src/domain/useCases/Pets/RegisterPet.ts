export type RegisterPetDTO = {
  name: string;
  age: number;
  category: 'cat' | 'dog' | 'bird' | 'other';
  ownerId: string;
  pictures?: string[]
}

export interface RegisterPet {
  register(params: RegisterPetDTO): Promise<void>
}
