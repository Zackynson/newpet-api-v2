interface UsersRepository {
  insert(user: User): Promise<void>
}

type User = {
  email: string;
  password: string;
  name: string;

}

class UsersRepositoryMock implements UsersRepository{
  users: User[] = []


  async insert({name, email, password}: User): Promise<void> {
      if(this.users.some(user => user.email === email)) return 
      this.users.push({name, email, password})
  }
}

const makeSut = () => {
  const sut = new UsersRepositoryMock()
  const user = { name: 'any_name', email: 'any_email', password:'any_password'}

  return { sut, user }
}
 
describe('CreateUser', () => {
  test('should create a user', async () => {
    const { sut, user } = makeSut()

    await sut.insert(user);

    expect(sut.users).toEqual([user])
  })

  test('should not create two users with same email', async () => {
    const { sut, user } = makeSut()

    await sut.insert(user);
    await sut.insert(user);

    expect(sut.users).toEqual([user])
  })
})