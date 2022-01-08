import { MongoClient, Collection } from 'mongodb';

export class MongoHelper {
  private client:MongoClient;

  async connect(url: string):Promise<void> {
    this.client = await MongoClient.connect(url);
  }

  async disconnect():Promise<void> {
    await this.client.close();
  }

  async getCollection(name:string):Promise<Collection> {
    return this.client.db().collection(name);
  }
}
