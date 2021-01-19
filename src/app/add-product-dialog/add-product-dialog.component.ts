import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../models/Product';
import { NotificationService } from '../services/notification.service';
import { ProductService } from '../services/product.service';


@Component({
  selector: 'app-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.css']
})
export class AddProductDialogComponent implements OnInit {

  product : Product;

  constructor(
    public dialogRef: MatDialogRef<AddProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private productService : ProductService,
    private notifier : NotificationService,
  ) { }

  ngOnInit(): void {
    this.product = this.data.product;
  }

  addProduct(){
    console.log(this.product);
    this.productService.save(this.product).subscribe(
      data=>{
        this.notifier.showSuccess("Product added Successfuly.");
        this.dialogRef.close(data);
      },
      error=>{
        this.notifier.showError(error);
      }
    );
  }

  updateProduct(){
    console.log("Update");
    console.log(this.product);
    this.productService.update(this.product).subscribe(
      data=>{
        this.notifier.showSuccess("Product Updated Successfuly.");
        this.dialogRef.close(this.product);
      },
      error=>{
        this.notifier.showError(error);
      });
  }
}
