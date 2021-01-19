import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  
  constructor(public snackBar: MatSnackBar) { }
  
  showMessage(message : string) : void {
    this.snackBar.open( message ,"", {duration:5000});
  }

  showSuccess(message: string): void {
    this.snackBar.open(message,"",{duration:5000, panelClass:['green-snackbar']});
  }
  
  showError(message: string): void {
    // The second parameter is the text in the button. 
    // In the third, we send in the css class for the snack bar.
    this.snackBar.open(message, 'X', {duration:5000,panelClass: ['red-snackbar']});
  }
}
