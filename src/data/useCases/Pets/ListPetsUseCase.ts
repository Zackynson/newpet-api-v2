import { Pet } from '@/domain/entities';
import { PetsRepository } from '@/domain/repositories/PetsRepository';
import { IListPetsUseCase } from '@/domain/useCases/Pets';

export class ListPetsUseCase implements IListPetsUseCase {
  constructor(private readonly petsRepository: PetsRepository) {}

  async execute():Promise<Pet[]> {
    return this.petsRepository.list();
  }
}
