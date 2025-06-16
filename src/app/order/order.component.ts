import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface CartItem {
  productName: string;
  price: number;
  quantity: number;
  seller?: string;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Simulating cart items fetch (replace with cart service or real API)
    this.cartItems = [
      { productName: 'Redmi Note 13', price: 12000, quantity: 1, seller: 'Mi Official' },
      { productName: 'Back Cover', price: 500, quantity: 2 },
    ];
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  confirmOrder(): void {
    alert('Order placed successfully!');
    // Optionally: send cartItems to your backend service here
  }
}
