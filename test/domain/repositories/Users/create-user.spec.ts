import { UsersRepositoryMock } from "@test/data/UserRepositoryMock";

const makeSut = () => {
  const sut = new UsersRepositoryMock()
  const user = { id:'any_id', name: 'any_name', email: 'any_email', password:'any_password' } 

  return { sut, user }
}

describe('Create user', () => {
  test('should create a user', async () => {
    const { sut, user } = makeSut()

    await sut.insert(user);

    expect(sut.users).toEqual([user])
  })

  test('should throw an error if email already exists', async () => {
    const { sut, user } = makeSut()

    sut.insert(user);
    const promise = sut.insert(user);

    await expect(promise).rejects.toThrowError('User already exists')
  })
})