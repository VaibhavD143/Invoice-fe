import { Component, Inject, OnInit, Pipe, PipeTransform, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Item } from '../models/Item';
import { NotificationService } from '../services/notification.service';

const tdata = [{"id":3,"name":"Product 3","quantity":3,"price":3.0},{"id":2,"name":"Product 2","quantity":2,"price":2.0},{"id":1,"name":"apro 1","quantity":1,"price":1.0}];

@Component({
  selector: 'app-add-item-dialog',
  templateUrl: './add-item-dialog.component.html',
  styleUrls: ['./add-item-dialog.component.css']
})
export class AddItemDialogComponent implements OnInit {

  
  item : Item;
  products;
  searchCtrl;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private notifier : NotificationService
  ) { }

  ngOnInit(): void {
    this.item = new Item(null, null, null, null);
    this.products = this.data['products'];
    console.log(this.products);
  }

  productChanged(){
    this.item.quantity = 0;
  }

  isNaN(n){
    return isNaN(n);
  }

  print(s){
    return JSON.stringify(s);
  }

}