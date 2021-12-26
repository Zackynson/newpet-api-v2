interface UsersRepository {
  insert(user: User): Promise<void>
  list(): Promise<User[] | undefined>
}

type User = {
  id?: string; 
  email: string;
  password: string;
  name: string;

}

class UsersRepositoryMock implements UsersRepository{
  users: User[] = []

  async insert(newUser: User): Promise<void> {
    if(this.users.some(user => user.email === newUser.email)) throw new Error('User already exists') 
    this.users.push(newUser)
  }
  
  async list(): Promise<User[]> {
    return this.users;
  }
}

const makeSut = () => {
  const sut = new UsersRepositoryMock()
  const user = { id:'any_id', name: 'any_name', email: 'any_email', password:'any_password' } 

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

    sut.insert(user);
    const promise = sut.insert(user);

    await expect(promise).rejects.toThrowError('User already exists')
  })

  test('Should bring an users list when list method is called', async () => {
    const { sut, user } = makeSut()

    await sut.insert(user);
    const users = await sut.list()

    expect(users).toEqual(sut.users)
  })

  test('sut.list should not throw if list is empty', async () => {
    const { sut } = makeSut()

    expect(sut.list()).resolves
  })
})