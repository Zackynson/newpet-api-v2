export type UpdateUserPetsParams = {
  petId: string;
  userId: string;
}

export interface UpdateUserPetsRepository {
 addPet(params: UpdateUserPetsParams): Promise<void>
}
