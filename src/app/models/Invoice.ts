import { Customer } from './Customer';
import { Item } from './Item';

export class Invoice{
  constructor(
    public id : number,
    public items : Array<Item>,
    public customer : Customer,
    public date : Date,
    public invoiceAmount : number,
  ){}
}