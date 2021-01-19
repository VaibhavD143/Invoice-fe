import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddProductDialogComponent } from '../add-product-dialog/add-product-dialog.component';
import { Product } from '../models/Product';
import { NotificationService } from '../services/notification.service';
import { ProductService } from '../services/product.service';

const tdata = [{"id":3,"name":"Product 3","quantity":3,"price":3.0},{"id":2,"name":"Product 2","quantity":2,"price":2.0},{"id":1,"name":"Product 1","quantity":1,"price":1.0}];


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})

export class ProductListComponent implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  dataSource;
  data;

  columnsToFilter = [
    "id",
    "name",
    "quantity",
    "price",

  ]
  
  columnsToDisplay = [
    "index",
    "id",
    "name",
    "quantity",
    "price",
    "action",
  ]
  constructor(
    private dialog: MatDialog,
    private productService : ProductService,
    private notifier : NotificationService,
  ) { }

  ngOnInit(): void {
    this.loadTable();
  }

  loadTable(){
    this.productService.findAll().subscribe(data=>{
      this.data = data;      
      console.log(this.data);
      
      this.loadFeature();
    },
    error=>{
      this.notifier.showError(error);
    })
    // this.data = tdata;
    
  }

  loadFeature(){
    this.dataSource = new MatTableDataSource(this.data);
    
    this.dataSource.sortingDataAccessor = (data: object, sortHeaderId: string) => {
      // sortHeaderId is from matColumnDef attribute.
      //'.' to split nested properties of the field
      const value: any = sortHeaderId.split('.').reduce((curObj, property) => curObj[property], data);
      return !isNaN(value) ? Number(value) : value;  //push each value into the array.
      
    };
      
    this.dataSource.filterPredicate = (data, filter) => {
      let dataStr = '';
      let keys;
      let keywords = filter.split(',');
      for (const keyword of keywords) {

        for (const column of this.columnsToFilter) {
          keys = column.split('.');
          dataStr += this.nestedFilter(data, keys);
        }
        dataStr = dataStr.trim().toLowerCase();
        if (dataStr.indexOf(keyword) == -1) {
          return false;
        }
      }
      return true
    }

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  nestedFilter(data, keys) {
    for (let key of keys) {
      data = data[key]
    }
    return data || '';
  }
  applyFilter(filterString: string) {
    this.dataSource.filter = filterString.trim().toLowerCase();
  }
  
  update(product){
    const dialogRef = this.dialog.open(AddProductDialogComponent,{
      data : {
        product : product,
        action : "update"
      },
      width: "300px",
    });
    dialogRef.afterClosed().subscribe(result=>{
      if(result == false){
        this.notifier.showError("Coudn't perform operation!")
      }
    });
    
  }

  addProduct(){
    const dialogRef = this.dialog.open(AddProductDialogComponent,{
      data : {
        product : new Product(null,null,null,null),
        action : "add"
      },
      width: "300px",
    });
    dialogRef.afterClosed().subscribe(result=>{
      if(result == false){
        this.notifier.showError("Coudn't perform operation!")
      }
      else{
        // this.data.push(result);
        this.data.splice(0,0,result);
        this.dataSource._updateChangeSubscription();
      }
    });
    
  }

}
