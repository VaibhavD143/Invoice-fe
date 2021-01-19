import { Product } from './Product';

export class Item{
  constructor (
    public id : number,
    public product : Product,
    public quantity : number,
    public amount : number,
  ) {}
}