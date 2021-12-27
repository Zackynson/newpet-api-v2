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

  test('Should not create a user when email already registered', async() => {
    const usersRepository = new UsersRepositoryMock()
    const sut = new CreateUserUseCase(usersRepository)

    const user: User = {
      email: 'same@email.com',
      name: 'any_name',
      avatar_url: 'any_url',
      password:'any_password'
    }

    const user2: User = {
      email: 'same@email.com',
      name: 'another_name',
      avatar_url: 'another_url',
      password:'another_password'
    }

    await sut.execute(user)

    await expect(sut.execute(user2)).rejects.toThrow()
  })

})