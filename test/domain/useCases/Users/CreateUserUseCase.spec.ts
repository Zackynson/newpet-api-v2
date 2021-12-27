import { User } from "@/domain/entities/User"
import { CreateUserUseCase } from "@/domain/useCases/CreateUserUseCase"
import { UsersRepositoryMock } from "@test/infra"

describe('CreateUserUseCase', () => {
  test('Should create a user when passing valid params', async() => {
    const usersRepository = new UsersRepositoryMock()
    const sut = new CreateUserUseCase(usersRepository)

    const user: User = {
      email: 'any_email@email.com',
      name: 'any_name',
      avatar_url: 'any_url',
      password:'any_password'
    }

    await sut.execute(user)

    expect(usersRepository.users[0]).toEqual(user)
  })
})