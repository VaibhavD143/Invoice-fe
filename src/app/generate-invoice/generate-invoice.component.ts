import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AddItemDialogComponent } from '../add-item-dialog/add-item-dialog.component';
import { Item } from '../models/Item';
import  pdfMake  from "pdfmake/build/pdfmake";  
import  pdfFonts  from "pdfmake/build/vfs_fonts";  
import { NotificationService } from '../services/notification.service';
import { ProductService } from '../services/product.service';
import { Customer } from '../models/Customer';
import { InvoiceService } from '../services/invoice.service';
import { Invoice } from '../models/Invoice';
import { Product } from '../models/Product';
import { Router } from '@angular/router';
import { GlobalConstants } from '../utils/global-constants';
import { NgForm } from '@angular/forms';
import { pathToFileURL } from 'url';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-generate-invoice',
  templateUrl: './generate-invoice.component.html',
  styleUrls: ['./generate-invoice.component.css']
})
export class GenerateInvoiceComponent implements OnInit {

  dataSource : MatTableDataSource<Item>;
  items;
  products ;
  customer : Customer;
  date : Date;
  invoice : Invoice;

  columnsToDisplay = [
    'index',
    'id',
    'name',
    'quantity',
    'price',
    'amount',
    'action'
  ]
  constructor(
    private notifier : NotificationService,
    private dialog : MatDialog,
    private invoiceService : InvoiceService,
    private productService : ProductService,
    private router :Router,
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.dataSource = new MatTableDataSource<Item>();
    this.customer = new Customer(null, null, null);
    this.date = new Date();

  }

  loadProducts(){
    // this.products = tdata;
    // return;
    this.productService.findAll().subscribe(data=>{
      this.products = data;
    })
  }

  addItem(){
    const dialogRef = this.dialog.open(AddItemDialogComponent,{
      data : {
        products : this.products,
      },
      width : "500px",
    })
    
    dialogRef.afterClosed().subscribe(result=>{
      if(result && result!=false){
        this.dataSource.data.push(result);
        for (let i = 0; i < this.products.length; i++) {
          const element = this.products[i];  
          if (element.id == result.product.id) {
            element.quantity-=result.quantity;
            break;
          }
        }
        this.dataSource._updateChangeSubscription();
        this.notifier.showSuccess("Item added.");
      }
      else{
        this.notifier.showMessage("Action discarded!");
      }
    }

    );
  }

  deleteItem(index){
    for (let i = 0; i < this.dataSource.data.length; i++) {
      const element = this.dataSource.data[i];

      if (element.product.id == this.dataSource.data[index].product.id) {
        element.product.quantity += this.dataSource.data[index].quantity;
        break;
      }
      
    }
    this.dataSource.data.splice(index,1);
    this.dataSource._updateChangeSubscription();
  }

  resetForm(customerForm : NgForm){
    customerForm.resetForm();
    this.dataSource = new MatTableDataSource<Item>();
    this.date = new Date();
  }

  confirmGenerateInvoice(customerForm : NgForm){
    const dialogRef =this.dialog.open(ConfirmationDialogComponent,{
      data : {
        title : "Confirmation",
        message : "Are you sure?",
        confirmationTitle : "Confirm",
        cancelTitle : "Cancel",
      },
      width : "300px",
    });

    dialogRef.afterClosed().subscribe(
      result=>{
        if(result){
          this.generateInvoice(customerForm);
        }
        else{
          this.notifier.showMessage("Action Discarded!");
        }
      }
    )
  }

  generateInvoice(customerForm : NgForm){
    console.log(new Invoice(null,this.dataSource.data,this.customer,this.date,null));
    this.invoiceService.saveInvoice(new Invoice(null,this.dataSource.data,this.customer,this.date,null)).subscribe(
      invoice =>{
        let docDefinition = {  
          footer : [
            {
              canvas: [
                { 
                  type: 'line',
                  x1: 0, 
                  y1: 5, 
                  x2: 595, 
                  y2: 5, 
                  lineWidth: 1 
                }
              ],
              margin : [0,0,0,-10],
            },
            {
              text: 'Plot No. 11, Gr. Floor, Paramhans Soc., Opp. Avalon, Ambatalavadi, Katargam, Surat-395004.',
              bold: true,
              alignment : 'center',
              margin : [0,20,0,0]  
            }
          ],
            
          content: [
            
            {
              image : "data:image/jpg;base64,"+GlobalConstants.encodedImage,
              width : 400,
              alignment : 'center',
              margin : [0,-40,0,0],
            },
            {
              canvas: [
                { 
                  type: 'line',
                  x1: 0, 
                  y1: 5, 
                  x2: 595, 
                  y2: 5, 
                  lineWidth: 1 
                }
              ],
              margin : [-40,0,0,0]
            },
            {
              canvas: [
                { 
                  type: 'line',
                  x1: 0, 
                  y1: 5, 
                  x2: 595, 
                  y2: 5, 
                  lineWidth: 1 
                }
              ],
              margin : [-40,2,0,10],
            },
            {  
              text: 'INVOICE',  
              fontSize: 20,  
              bold: true,  
              alignment: 'center',  
              decoration: 'underline',
            },
            {  
              text: 'Customer Details',  
              style: 'sectionHeader',
            },
            {  
              columns: 
              [  
                [  
                  {  
                    text: 'Name       : ' + invoice['customer']['name'],  
                    bold: true,
                    fontSize : 14 
                  },
                  {},
                  { 
                    text: 'Contact No : ' + invoice['customer']['contactNumber'], 
                  }  
                ],  
                [  
                  {  
                    text: `Date: ` + new Date(invoice['date']).toLocaleDateString() ,  
                    alignment: 'right'  
                  },
                  {},  
                  {  
                    text: `Bill No : ` + invoice['id'],  
                    alignment: 'right'  
                  }  
                ]  
              ]  
            },
            {  
              text: 'Order Details',  
              style: 'sectionHeader'  
            },  
            {  
              table: {  
                headerRows: 1,  
                widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],  
                body: [  
                  ['No','Product', 'Product Id', 'Price', 'Quantity', 'Amount'],  
                  ...this.dataSource.data.map((item,i) => ([i+1,item.product.name, item.product.id, item.product.price, item.quantity, (item.product.price * item.quantity).toFixed(2)])),  
                  [{ text: 'Total Amount', colSpan: 5 },{}, {}, {}, {}, (invoice['invoiceAmount']).toFixed(2)]
                ]  
              }  
            }    
          ],  
          styles: {  
              sectionHeader: {  
                  bold: true,  
                  fontSize: 16,  
                  margin: [0, 15, 0, 15],
                  decoration : 'underline',
              }  
          }
        };
       
        pdfMake.createPdf(docDefinition).open();
        this.resetForm(customerForm);
      },
      error=>{
        this.notifier.showError(error);
      });

  }

}