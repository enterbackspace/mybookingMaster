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
this.cartItems.forEach(item => {
  item.selected = false;
});
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
 

  generateRandomId(): string {
        return Math.random().toString(36).substr(2, 9);
      }
 

placeSelectedOrder() {
  const selectedItems = this.cartItems.filter(item => item.selected);
  if (selectedItems.length === 0) {
    this.toastr.warning('Please select at least one item.', 'No Selection');
    return;
  }

  this.http.get<any[]>('http://localhost:3000/orders').subscribe({
    next: (existingOrders) => {
      selectedItems.forEach(item => {
        const existingOrder = existingOrders.find(order =>
          order["0"]?.productId === item.productId &&
          order["0"]?.userId === this.userId
        );

        const removeFromCart = () => {
          this.http.delete(`http://localhost:3000/Cart/${item.id}`).subscribe({
            next: () => {
              console.log(`Removed ${item.productName} from cart.`);
              window.dispatchEvent(new Event('cartChanged'));
            },
            error: (err) => {
              console.error('Failed to remove item from cart:', err);
            }
          });
        };

        if (existingOrder) {
          const updatedOrder = {
            ...existingOrder,
            "0": {
              ...existingOrder["0"],
              quantity: existingOrder["0"].quantity + (item.quantity || 1)
            }
          };
          this.http.put(`http://localhost:3000/orders/${existingOrder.id}`, updatedOrder).subscribe({
            next: () => {
              this.toastr.success(`Quantity updated for ${item.productName}`, 'Updated');
              removeFromCart();
              this.router.navigate(['/dash/Checkout']);
            },
            error: (err) => {
              console.error('Update failed:', err);
              this.toastr.error('Failed to update order.', 'Error');
            }
          });
        } else {
          const newOrder = {
            "0": {
              id: this.generateRandomId(),
              userId: this.userId,
              productId: item.productId,
              quantity: item.quantity || 1,
              productName: item.productName,
              price: item.price,
              mrp: item.mrp,
              image: item.imageUrl,
              selected: true
            },
            id: this.generateRandomId()
          };

          this.http.post('http://localhost:3000/orders', newOrder).subscribe({
            next: () => {
              this.toastr.success(`Order placed for ${item.productName}`, 'Success');
              removeFromCart();
              this.router.navigate(['/dash/Checkout']);
            },
            error: (err) => {
              console.error('Placement failed:', err);
              this.toastr.error('Failed to place order.', 'Error');
            }
          });
        }
      });
    },
    error: (err) => {
      console.error('Failed to fetch orders:', err);
      this.toastr.error('Failed to load existing orders.', 'Error');
    }
  });
}




 
}
