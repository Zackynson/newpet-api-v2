interface UsersRepository {
  insert(user: User): Promise<void>
  list(): Promise<User[] | undefined>
  findById(id: string): Promise<User | undefined>
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
    if(this.users.some(u => u.email === newUser.email)) throw new Error('User already exists') 
    this.users.push(newUser)
  }
  
  async list(): Promise<User[]> {
    return this.users;
  }

  async findById(id: string): Promise<User | undefined> {
    return this.users.find(u => u.id === id)
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


  test('sut.findById should return an user if id exists', async () => {
    const { sut, user } = makeSut()
    const newUser = { id: 'new_user_id', email:'new_email', password:'new_password', name:'new_user' }

    await sut.insert(user)
    await sut.insert(newUser)

    const foundUser = await sut.findById('new_user_id');

    expect(foundUser).toEqual(newUser)
  })

  test('sut.findById should return undefined user is not found', async () => {
    const { sut, user } = makeSut()
    const newUser = { id: 'new_user_id', email:'new_email', password:'new_password', name:'new_user' }

    await sut.insert(user)
    await sut.insert(newUser)
    const foundUser = await sut.findById('invalid_id');

    expect(foundUser).toEqual(undefined)
  })
})