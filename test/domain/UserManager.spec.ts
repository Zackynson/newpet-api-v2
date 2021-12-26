import { User } from "@/domain/entities/User";
import { UsersRepository } from "@/domain/repositories/UserRepository";

class UsersRepositoryMock implements UsersRepository {
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

  async delete(id: string): Promise<void> {
    const userIndex = this.users.findIndex(u => u.id === id)
    if(userIndex < 0) throw new Error('User not found');
    this.users.splice(userIndex, 1)
  }
}

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
    const { sut,mockUsersList } = makeSut()

    await mockUsersList()
    const usersList = await sut.list()

    expect(usersList.length).toBe(3)
  })


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