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
      this.users.push({name, email, password})
  }
}


describe('CreateUser', () => {
  test('should create a user', async () => {
    const sut = new UsersRepositoryMock()
    const user = { name: 'any_name', email: 'any_email', password:'any_password'}

    await sut.insert(user);

    expect(sut.users).toEqual([user])
  })
})