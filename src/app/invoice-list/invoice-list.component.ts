import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Invoice } from '../models/Invoice';
import { InvoiceService } from '../services/invoice.service';
import { NotificationService } from '../services/notification.service';
import  pdfMake  from "pdfmake/build/pdfmake";  
import  pdfFonts  from "pdfmake/build/vfs_fonts";  
import { GlobalConstants } from '../utils/global-constants';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {

  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  dataSource;
  data;

  columnsToDisplay = [
    "index",
    "id",
    "customer.name",
    "customer.contactNumber",
    "date",
    "invoiceAmount",
    "action",
  ];
  
  columnsToFilter = [
    "id",
    "customer.name",
    "customer.contactNumber",
    "date",
    "invoiceAmount",
  ];

  constructor(
    private notifier : NotificationService,
    private invoiceService : InvoiceService,
  ) { }

  ngOnInit(): void {
    this.loadTable();
  }

  loadTable(){
    this.invoiceService.findAllInvoices().subscribe(data=>{
      this.data = data;      
      console.log(this.data);
      this.loadFeature();
    },
    error=>{
      this.notifier.showError(error);
    });
    
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
  
  generateInvoice(invoice : Invoice){
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
          image : "data:image/jpg;base64," + GlobalConstants.encodedImage,
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
              ...invoice.items.map((item,i) => ([i+1,item.product.name, item.product.id, item.product.price, item.quantity, (item.product.price * item.quantity).toFixed(2)])),  
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
  }

}
