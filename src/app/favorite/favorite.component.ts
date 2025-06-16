import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent {
  favouriteItems: any[] = [];
  userId: string = localStorage.getItem('userId') || '1';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.loadFavourites();
  }

  loadFavourites() {
    this.http.get<any[]>('http://localhost:3000/Favorite').subscribe({
      next: (data) => {
        this.favouriteItems = data.filter(item => item.userId === this.userId);
      },
      error: (error) => {
        console.error('Failed to load favourites:', error);
        this.toastr.error('Failed to load favourites');
      }
    });
  }

  removeFromFavourite(id: string) {
    this.http.delete(`http://localhost:3000/Favorite/${id}`).subscribe({
      next: () => {
        this.favouriteItems = this.favouriteItems.filter(item => item.id !== id);
        this.toastr.success('Removed from favourites');
        window.dispatchEvent(new Event('FavouriteChanged'));
      },
      error: (err) => {
        console.error('Failed to remove item from favourites:', err);
        this.toastr.error('Failed to remove from favourites');
      }
    });
  }

  moveToCart(item: any) {
    const cartItem = {
      userId: item.userId,
      productId: item.productId,
      productName: item.productName,
      price: item.price,
      mrp: item.mrp,
      image: item.image
    };
    this.http.get<any[]>(`http://localhost:3000/Cart?userId=${item.userId}&productId=${item.productId}`).subscribe({
      next: (existing) => {
        if (existing.length > 0) {
          this.toastr.warning('Item already exists in cart');
        } else {
          this.http.post('http://localhost:3000/Cart', cartItem).subscribe({
            next: () => {
              this.removeFromFavourite(item.id);
              this.toastr.success('Item moved to cart');
              window.dispatchEvent(new Event('cartChanged'));
              window.dispatchEvent(new Event('FavouriteChanged'));
            },
            error: () => {
              this.toastr.error('Failed to add to cart');
            }
          });
        }
      },
      error: () => {
        this.toastr.error('Error checking for duplicates in cart');
      }
    });
  }

  clicktoproduct() {
    this.router.navigate(['/dash/user']).catch(err => {
      console.error('Navigation error:', err);
    });
  }
}
