export type Pet = {
  id?:string
  name: string;
  age: number;
  category: 'cat' | 'dog' | 'bird' | 'other';
  ownerId: string;
}
