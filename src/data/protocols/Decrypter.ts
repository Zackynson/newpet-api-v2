export interface Decrypter{
  compare(hash:string, plainText: string): Promise<boolean>;
}
