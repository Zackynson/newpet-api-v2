export interface IDeletePetUseCase {
  execute(petId: string, ownerId: string):Promise<void>
}
