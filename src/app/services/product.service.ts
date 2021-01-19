import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../models/Product';
import { GlobalConstants } from '../utils/global-constants';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private httpClient : HttpClient,
  ) { }

  public findAll(){
    return this.httpClient.get(GlobalConstants.findAllProducts);
  }

  public update(product : Product){
    return this.httpClient.post(GlobalConstants.updateProduct,product);
  }

  public save(product : Product){
    return this.httpClient.post(GlobalConstants.saveProduct,product);
  }
}
