import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { OrderComponent } from '../order/order.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  constructor(
    public http: HttpClient,
    public route: Router,
    public dialog: MatDialog
  ) {}

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
  itemTotalFormatted: string = '';
  totalWithPlatformFee: number = 0;
  totalDiscount: number = 0;
  totalMRP: number = 0;
  cartItemss: any[] = []; // used in calculation

  ngOnInit() {
    this.userName = sessionStorage.getItem('username') || '';
    this.phone = sessionStorage.getItem('mobile') || '';
    this.email = sessionStorage.getItem('email') || '';

    const addressString = sessionStorage.getItem('address');
    if (addressString) {
      this.address = JSON.parse(addressString);
    } else {
      this.address = null;
    }

    this.userId = sessionStorage.getItem('id') || '';
    if (!this.userId) {
      alert('User ID not found. Please log in again.');
      return;
    }

    this.getorders();
  }

  getorders() {
    this.userId = sessionStorage.getItem('id') || '';
    this.http.get<any[]>(`http://localhost:3000/orders?userId=${this.userId}`).subscribe({
      next: (items) => {
        this.cartItems = items;
        this.cartItemss = items.map(item => item["0"]);
        console.log('Cart items fetched:', this.cartItems);
        this.calculateTotal();
      },
      error: (err) => {
        console.error('Failed to fetch cart items:', err);
      }
    });
  }

  calculateTotal() {
    this.itemTotal = this.cartItemss.reduce((sum, item) => {
      const mrp = parseFloat(item.mrp) || 0;
      const discountPercent = parseFloat(item.discount) || 0;
      const quantity = Number(item.quantity) || 0;
      const discountAmount = (mrp * discountPercent) / 100;
      const priceAfterDiscount = mrp - discountAmount;
      return sum + (priceAfterDiscount * quantity);
    }, 0);

    this.itemTotalFormatted = this.itemTotal.toFixed(2);
    this.totalWithPlatformFee = this.itemTotal + this.platformFee;
    this.totalPayable = this.totalWithPlatformFee;

    this.totalMRP = this.cartItemss.reduce((sum, item) => {
      return sum + ((parseFloat(item.mrp) || 0) * (Number(item.quantity) || 0));
    }, 0);

    this.totalDiscount = this.totalMRP - this.itemTotal;
    this.grandTotal = parseFloat((this.totalPayable - this.totalDiscount).toFixed(2));

    if (this.totalPayable < 0) this.totalPayable = 0;
  }


submitOrder() {
  if (this.cartItems.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  const dialogItems = this.cartItems.map(item => {
    const data = item['0'];
    const mrp = parseFloat(data.mrp);
    const discount = parseFloat(data.discount);
    const price = mrp - ((mrp * discount) / 100);

    return {
      id: item.id,
      userId: data.userId,
      productId: data.productId,
      productName: data.productName,
      quantity: Number(data.quantity),
      selected: data.selected,
      image: data.image || 'https://static.vecteezy.com/system/resources/previews/022/014/063/original/missing-picture-page-for-website-design-or-mobile-app-design-no-image-available-icon-vector.jpg',
      price: parseFloat(price.toFixed(2))
    };
  });

  console.log('✅ Dialog items:', dialogItems);

  this.dialog.open(OrderComponent, {
    width: '90%',
    maxWidth: '100%',
    height: '90vh',
    panelClass: 'order-dialog',
    data: {
      cartItems: dialogItems,
      total: this.totalPayable
    }
  });
}

}
