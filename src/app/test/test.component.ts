import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  invoiceItemsForm : FormGroup;
  
  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.invoiceItemsForm = this.fb.group({
      invoiceItems : this.fb.array([]),
    });
  }

  addItem() : FormGroup {
    return this.fb.group({
      fund : [],
    });
  }

  add(){
    (this.invoiceItemsForm.get('invoiceItems') as FormArray).push(this.addItem());
    console.log(this.invoiceItemsForm.get('invoiceItems'));
    
  }
  get invoiceItems(){
    return this.invoiceItemsForm.get('invoiceItems') as FormArray;
  }

}
