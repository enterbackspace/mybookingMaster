import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Toast, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  userId: any = '';
  totalMRP: number = 0;
  totalDiscount: number = 0;
  grandTotal: number = 0;
deliveryDate: Date = new Date(new Date().setDate(new Date().getDate() + 2));

  constructor(private http: HttpClient, private router: Router,public toastr:ToastrService) {}

  ngOnInit(): void {
    this.userId = sessionStorage.getItem('id');
 
    if (!this.userId) {
      alert('User ID not found. Please log in again.');
      return;
    }

    this.loadCartFromServer();
  }

  loadCartFromServer() {
    this.http.get<any[]>(`http://localhost:3000/Cart?userId=${this.userId}`).subscribe({
      next: (data) => {
        this.cartItems = data;
        this.calculateTotals();
      },
      error: (err) => {
        console.error('Failed to fetch cart data:', err);
        alert('Unable to load cart from server.');
      }
    });
  }

  calculateTotals() {
    this.totalMRP = this.cartItems.reduce((sum, item) => sum + (item.mrp * item.quantity), 0);
    this.grandTotal = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    this.totalDiscount = this.totalMRP - this.grandTotal;
  }

  increaseQty(item: any) {
    item.quantity++;
    this.updateCart(item);
  }

  decreaseQty(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.updateCart(item);
    }
  }
  removeItem(id: any) {
  this.http.delete(`http://localhost:3000/Cart/${id}`).subscribe({
    next: () => {
      this.cartItems = this.cartItems.filter(i => i.id !== id);
      this.toastr.success('Item removed successfully.', 'Success');
      window.dispatchEvent(new Event('cartChanged'));
    },
    error: (err) => {
      console.error('Remove item failed:', err);
      this.toastr.error('Failed to remove item.', 'Error');
    }
  });
}
 
  updateCart(item: any) {
    this.http.put(`http://localhost:3000/Cart/${item.id}`, item).subscribe({
      next: () => {
        this.calculateTotals();
      },
      error: (err) => {
        console.error('Failed to update cart:', err);
        alert('Error updating cart.');
      }
    });
  }

goToMarket(){
  this.router.navigate(['/dash/user']).catch(err => console.error('Navigation error:', err));
}
  

checkout() {
  this.router.navigate(['/dash/Checkout']).catch(err => console.error('Navigation error:', err));

}
 
}
