import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Invoice } from '../models/Invoice';
import { GlobalConstants } from '../utils/global-constants';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(
    private httpClient : HttpClient,
  ) { }

  public saveInvoice(invoice : Invoice) {
    console.log(JSON.stringify(invoice));
    return this.httpClient.post(GlobalConstants.saveInvoice,invoice);
  }

  public findAllInvoices(){
    return this.httpClient.get(GlobalConstants.findAllInvoices);
  }

}
