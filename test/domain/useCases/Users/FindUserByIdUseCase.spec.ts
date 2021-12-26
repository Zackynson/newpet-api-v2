import { UsersRepositoryMock } from "@test/domain/repositories/UserRepositoryMock";

const makeSut = () => {
  const sut = new UsersRepositoryMock()

  const mockUsersList = async () => {
    await sut.insert({ id: '1', email:'email_1', password:'new_password', name:'new_user_1' })
    await sut.insert({ id: '2', email:'email_2', password:'new_password', name:'new_user_2' })
    await sut.insert({ id: '3', email:'email_3', password:'new_password', name:'new_user_3' })

  }

  return { sut, mockUsersList }
}

describe('FindUserByIdUseCase', () => {
  test('sut.findById should return an user if id exists', async () => {
    const { sut, mockUsersList } = makeSut()
    const newUser = { id: 'new_user_id', email:'new_email', password:'new_password', name:'new_user' }

    await mockUsersList()
    await sut.insert(newUser)

    const foundUser = await sut.findById('new_user_id');

    expect(foundUser).toEqual(newUser)
  })

  test('sut.findById should return undefined user is not found', async () => {
    const { sut, mockUsersList } = makeSut()
    const newUser = { id: 'new_user_id', email:'new_email', password:'new_password', name:'new_user' }

    await mockUsersList()
    const foundUser = await sut.findById(newUser.id);

    expect(foundUser).toEqual(undefined)
  })
})