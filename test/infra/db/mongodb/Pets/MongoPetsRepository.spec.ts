import { MongoPetsRepository } from '@/infra/db/mongodb/Pets/MongoPetsRepository';

import { MongoHelper } from '@/infra/db/mongodb/helpers/MongoHelper';
import { RegisterPetData } from '@/data/protocols/Pets/RegisterPetRepository';

describe('MongoPetsRepository', () => {
  beforeAll(async () => { await MongoHelper.connect(process.env.MONGO_URL); });
  afterAll(async () => { await MongoHelper.disconnect(); });

  beforeEach(async () => {
    const collection = await MongoHelper.getCollection('pets');
    await collection.deleteMany({});
  });

  test('Should register a Pet on success', async () => {
    const sut = new MongoPetsRepository();

    const pet: RegisterPetData = {
      name: 'any_name',
      age: 1,
      category: 'bird',
      ownerId: 'any_onwer_id',
      pictures: ['pic1', 'pic2'],
    };

    const registeredPet = await sut.register(pet);

    expect(registeredPet).toBeTruthy();
    expect(registeredPet.id).toBeTruthy();
    expect(registeredPet.name).toBe('any_name');
    expect(registeredPet.age).toBe(1);
    expect(registeredPet.category).toBe('bird');
    expect(registeredPet.pictures).toEqual([
      'pic1',
      'pic2',
    ]);
  });
});
