import { UsersRepositoryMock } from "@test/data/UserRepositoryMock";

const makeSut = () => {
  const sut = new UsersRepositoryMock()
  const user = { id:'any_id', name: 'any_name', email: 'any_email', password:'any_password' } 

  const mockUsersList = async () => {
    await sut.insert({ id: '1', email:'email_1', password:'new_password', name:'new_user_1' })
    await sut.insert({ id: '2', email:'email_2', password:'new_password', name:'new_user_2' })
    await sut.insert({ id: '3', email:'email_3', password:'new_password', name:'new_user_3' })

  }

  return { sut, user, mockUsersList }
}

describe('DeleteUserUseCase', () => {
  test('sut.delete should throw if user is not found', async () => {
    const { sut, mockUsersList } = makeSut()

    await mockUsersList()
    const promise = sut.delete('invalid_id')

    await expect(promise).rejects.toThrow()
  })

  test('sut.delete should delete user if id exists', async () => {
    const { sut, mockUsersList } = makeSut()

    await mockUsersList()

    const userToBeDeleted = sut.users.find(u => u.id === '1') 
    await sut.delete('1')
    const userAfterDeletion = sut.users.find(u => u.id === '1') 

     expect(userToBeDeleted?.id).toBe('1')
     expect(userAfterDeletion?.id).toBe(undefined)
  })
})