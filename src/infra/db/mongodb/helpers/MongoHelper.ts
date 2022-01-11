import { MongoClient, Collection } from 'mongodb';

export const MongoHelper = {
  client: null as MongoClient,
  url: null as string,

  async connect(url: string):Promise<void> {
    this.client = await MongoClient.connect(url);
    this.url = url;
  },

  async disconnect():Promise<void> {
    await this.client.close();
    this.client = null;
  },

  async getCollection(name:string):Promise<Collection> {
    if (!this.client?.db) {
      await this.connect(this.url);
    }

    return this.client.db().collection(name);
  },
};
