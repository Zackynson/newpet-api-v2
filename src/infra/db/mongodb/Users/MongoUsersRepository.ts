/* eslint-disable no-underscore-dangle */
import { CreateUserParams, CreateUserRepository } from '@/data/protocols/Users';
import { User } from '@/domain/entities';
import { MongoHelper } from '@/infra/db/mongodb/helpers/MongoHelper';
import { format } from '@/infra/db/mongodb/Users/UserFormatter';

export class MongoUsersRepository implements CreateUserRepository {
  constructor(private readonly mongoHelper: MongoHelper) {}

  async insert(user: CreateUserParams): Promise<User> {
    const usersCollection = await this.mongoHelper.getCollection('users');
    const result = await usersCollection.insertOne(user);

    const foundInsertedUser = await usersCollection.findOne({ _id: result.insertedId });

    return format(foundInsertedUser);
  }
}
