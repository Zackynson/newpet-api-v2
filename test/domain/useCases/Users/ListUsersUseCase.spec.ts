import { UsersRepositoryMock } from "@test/domain/repositories/UserRepositoryMock";

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
 
describe('UserManager', () => {
  test('Should bring an users list when list method is called', async () => {
    const { sut, user } = makeSut()

    await sut.insert(user);
    const users = await sut.list()

    expect(users).toEqual(sut.users)
  })

  test('sut.list should not throw if list is empty', async () => {
    const { sut,mockUsersList } = makeSut()

    await mockUsersList()
    const usersList = await sut.list()

    expect(usersList.length).toBe(3)
  })
})