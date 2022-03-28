/* eslint-disable no-underscore-dangle */
import { ObjectId } from 'mongodb';
import { RegisterPetData, RegisterPetRepository } from '@/data/protocols/Pets/RegisterPetRepository';
import { Pet } from '@/domain/entities';
import { MongoHelper } from '@/infra/db/mongodb/helpers/MongoHelper';
import { format } from '@/infra/db/mongodb/Pets/PetFormatter';

export class MongoPetsRepository implements RegisterPetRepository {
  async register(params: RegisterPetData): Promise<Pet> {
    const petCollection = await MongoHelper.getCollection('pets');
    // eslint-disable-next-line max-len
    const register = await petCollection.insertOne({ ...params, ownerId: new ObjectId(params.ownerId) });

    const pet = await petCollection.findOne({ _id: register.insertedId });

    return format(pet);
  }
}
