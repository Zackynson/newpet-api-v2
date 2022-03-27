/* eslint-disable no-underscore-dangle */
import { ObjectId } from 'mongodb';
import { TokenDecrypter } from '@/data/protocols';
import {
  LoadUserByTokenRepository,
} from '@/data/protocols/Users';
import { User } from '@/domain/entities';
import { MongoHelper } from '@/infra/db/mongodb/helpers/MongoHelper';
import { format } from '@/infra/db/mongodb/Users/UserFormatter';

export class MongoLoadUserByTokenRepository implements LoadUserByTokenRepository {
  async loadByToken(token: string): Promise<User> {
    const usersCollection = await MongoHelper.getCollection('users');

    const foundInsertedUser = await usersCollection.findOne({ _id: new ObjectId(token) });

    return format(foundInsertedUser);
  }
}

export namespace MongoLoadUserByTokenRepository {
  export type Params = {
    tokenDecrypter: TokenDecrypter
  }
}
