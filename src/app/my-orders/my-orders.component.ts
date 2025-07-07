import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {

  orders: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.http.get<any[]>('http://localhost:3000/myOrder').subscribe({
      next: (data) => {
        this.orders = data;
        console.log('Orders:', this.orders);
      },
      error: (err) => {
        console.error('Error fetching orders:', err);
      }
    });




  }



  submitRating(order: any) {
  console.log(`Rating submitted for ${order.productName}: ${order.rating} stars`);
  // You can send this to your backend via a service
    // handle success or error
  
}

}
