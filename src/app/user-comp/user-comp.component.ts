import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-user-comp',
  templateUrl: './user-comp.component.html',
  styleUrls: ['./user-comp.component.css']
})
export class UserCompComponent implements OnInit {
  cartItems: any[] = [];
  product: any[] = [];
  Search:string='';
  userId: any = sessionStorage.getItem('id');
productAddedSet = new Set<string>()
productAdded: boolean = false
  constructor(public route: Router, public http: HttpClient, public toastr: ToastrService) {}
  ngOnInit(): void {
    this.http.get('http://localhost:3000/vegitable').subscribe({
      next: (data: any) => {
        this.product = data;
        console.log('Product data fetched successfully:', this.product);
      },
      error: (err) => {
        console.error('Error fetching product data:', err);
        // Utility method to generate a random ID
        
      }
    });
  }
  goToCart() {
    this.route.navigate(['/dash/cart'])
  }
  isProductAdded(product: any): boolean {
  return this.productAddedSet.has(product.productId);
}


addToCart(product: any) {
  this.http.get<any[]>(`http://localhost:3000/Cart?userId=${this.userId}&productId=${product.productId}`).subscribe(existingItems => {
    if (existingItems.length > 0) {
      this.toastr.warning('Product is already in the cart.see the cart');
      this.route.navigate(['/dash/cart']);
      return;
    }

    const cartItem = {
      userId: this.userId,
      productId: product.productId,
      quantity: 1,
      productName: product.ProductName,
      price: product.price,
      mrp: product.mrp,
      image: product.imageUrl
    };

    this.http.post('http://localhost:3000/Cart', cartItem).subscribe({
      next: (response) => {
        window.dispatchEvent(new Event('product_added'));
        console.log('Cart item saved to server:', response);
        this.toastr.success('Product added to cart.');
        this.productAddedSet.add(product.productId); // Update set after success
      },
      error: (error) => {
        console.error('Failed to save item to server:', error);
        this.toastr.error('Could not sync cart with server.');
      }
    });
  });
}


toggleFavorite(product: any) {
  product.favorite = !product.favorite;
}


toggleFavoriteStatus(product: any) {
  if (product.favorite) {
    this.deleteFromFav(product);
  } else {
    this.addToFav(product);
  }
}


addToFav(product: any) {
  const productId = product.productId;

  // Check if this favorite already exists for the user
  this.http.get<any[]>(`http://localhost:3000/Favorite?userId=${this.userId}&productId=${productId}`).subscribe(existing => {
    if (existing.length > 0) {
      this.toastr.info(`${product.ProductName} is already in your Favorites.`);
      return;
    }

    const favoriteItem = {
      userId: this.userId,
      productId: productId,
      productName: product.ProductName,
      price: product.price,
      mrp: product.mrp,
      image: product.imageUrl
    };

    this.http.post('http://localhost:3000/Favorite', favoriteItem).subscribe({
      next: (response) => {
        this.toggleFavorite(product);
        window.dispatchEvent(new Event('FavouriteChanged'));
        this.toastr.success(`${product.ProductName} added to Favorites!`);
      },
      error: (error) => {
        console.error('Failed to save to server:', error);
        this.toastr.error('Could not sync favorites with server.');
      }
    });
  });
}


deleteFromFav(product: any) {
  // Step 1: Find the favorite item by productId and userId
  this.http.get<any[]>(`http://localhost:3000/Favorite?productId=${product.productId}&userId=${this.userId}`).subscribe({
    next: (favorites) => {
      if (favorites.length > 0) {
        const favId = favorites[0].id;

        // Step 2: Delete the favorite item using its actual ID
        this.http.delete(`http://localhost:3000/Favorite/${favId}`).subscribe({
          next: () => {
            product.favorite = false; // Update UI
            this.toastr.success(`${product.ProductName} removed from Favorites!`);
            window.dispatchEvent(new Event('FavouriteChanged'));
          },
          error: (err) => {
            console.error('Failed to remove item from favorites:', err);
            this.toastr.error('Failed to remove from favorites');
          }
        });
      } else {
        this.toastr.warning('Favorite item not found.');
      }
    },
    error: (err) => {
      console.error('Failed to fetch favorite item:', err);
      this.toastr.error('Could not find favorite item to remove.');
    }
  });
}
 
 generateRandomId(): string {
          return Math.random().toString(36).substr(2, 9);
        }

 
placeSelectedOrder(product: any) {
  const formattedOrder = {
    "0": {
      id: product.id,
      userId:this.userId,
      productId: product.productId,
      quantity: 1,
      productName: product.ProductName,
      // price: product.price,
      mrp: product.mrp,
      discount: product.discount || 0,
      image: product.imageUrl,
      selected: true
    },
    id: this.generateRandomId() // Unique order ID
  };

  this.http.post('http://localhost:3000/orders', formattedOrder).subscribe({
    next: () => {
      this.toastr.success('Order placed successfully!', 'Success');
      this.route.navigate(['/dash/Checkout']);
    },
    error: (err) => {
      console.error('Order placement failed:', err);
      this.toastr.error('Failed to place order.', 'Error');
    }
  });
}
 

}



 