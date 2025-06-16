import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Dialog } from '@angular/cdk/dialog';
import { OrderComponent } from '../order/order.component';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  constructor(public http: HttpClient,public route:Router,public dialog:Dialog) { }
  userName: string = '';
  userId: any = sessionStorage.getItem('id');
  address: any = '';
  phone: string = '';
  paymentMethod: string = ''; 
   grandTotal: number = 0;
  deliveryDate: Date = new Date(new Date().setDate(new Date().getDate() + 2));

  cartItems: any[] = [];
itemTotal: number = 0;
platformFee: number = 4;
totalPayable: number = 0;
email: string = '';

ngOnInit() {
  this.userName = sessionStorage.getItem('username') || '';
  // this.address = sessionStorage.getItem('address') || '';
  this.phone = sessionStorage.getItem('mobile') || '';
  this.email = sessionStorage.getItem('email') || '';
  const addressString = sessionStorage.getItem('address');
if (addressString) {
  this.address = JSON.parse(addressString);
} else {
  this.address = null; // or {}
}


  this.http.get<any[]>(`http://localhost:3000/Cart?userId=${this.userId}`).subscribe((items) => {
    this.cartItems = items;
    this.itemTotal = items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    this.totalPayable = this.itemTotal + this.platformFee;
  });
}
submitOrder() {
  console.log('submitOrder called');
  this.dialog.open(OrderComponent, {
    width: '90%',
    maxWidth: '100%',
    height: '90vh',
    panelClass: 'order-dialog',
    data: {
      cartItems: this.cartItems,
      total: this.grandTotal + 19
    }
  });
}



}





 