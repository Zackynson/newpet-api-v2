/* eslint-disable no-underscore-dangle */
import { ObjectId } from 'mongodb';
import {
  UpdateUserPetsParams,
  CreateUserParams, CreateUserRepository, FindUserByEmailRepository, UpdateUserPetsRepository,
} from '@/data/protocols/Users';
import { User } from '@/domain/entities';
import { MongoHelper } from '@/infra/db/mongodb/helpers/MongoHelper';
import { format } from '@/infra/db/mongodb/Users/UserFormatter';

export class MongoUsersRepository
implements
  CreateUserRepository,
  FindUserByEmailRepository,
  UpdateUserPetsRepository {
  async findByEmail(email: string): Promise<User> {
    const usersCollection = await MongoHelper.getCollection('users');
    const foundInsertedUser = await usersCollection.findOne({ email });

    return format(foundInsertedUser);
  }

  async insert(user: CreateUserParams): Promise<User> {
    const usersCollection = await MongoHelper.getCollection('users');
    const result = await usersCollection.insertOne(user);

    const foundInsertedUser = await usersCollection.findOne({ _id: result.insertedId });

    return format(foundInsertedUser);
  }

  async addPet(params: UpdateUserPetsParams): Promise<void> {
    const { petId, userId } = params;

    const usersCollection = await MongoHelper.getCollection('users');

    await usersCollection.updateOne({ _id: new ObjectId(userId) }, {
      $push: {
        pets: new ObjectId(petId),
      },
    });
  }
}
