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
      if(this.users.some(user => user.email === email)) throw new Error('User already exists') 
      this.users.push({name, email, password})
  }
}

const makeSut = () => {
  const sut = new UsersRepositoryMock()
  const user = { name: 'any_name', email: 'any_email', password:'any_password'}

  return { sut, user }
}
 
describe('UserManager', () => {
  test('should create a user', async () => {
    const { sut, user } = makeSut()

    await sut.insert(user);

    expect(sut.users).toEqual([user])
  })

  test('should throw an error if email already exists', async () => {
    const { sut, user } = makeSut()

    const promise =  sut.insert(user);

    expect(promise).rejects.toThrowError('User already exists')
  })
})