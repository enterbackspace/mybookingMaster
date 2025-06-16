import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ServiceService } from '../service.service';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge'
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  username: string | null = null;
  name: string | null = null;
  email: string | null = null;
  profile: string | null = null;
  id: any | null = null;
  userRole: string | null = null;

  constructor(public toastr:ToastrService,public login:ServiceService,public route:Router,public http:HttpClient ){
    

  }

searchText:any[]=[]
   cartItems = 0; 
  notifications = 0;  
  isLoggedIn = false; 
cartCount: number = 0;

  Search: string = '';


imports: [ CommonModule, MatMenuModule ] 
 
 

ngOnInit(): void {
  this.username = sessionStorage.getItem('username');
  this.email = sessionStorage.getItem('email');
  this.profile = sessionStorage.getItem('profile');
  this.id = sessionStorage.getItem('id');
  this.userRole = sessionStorage.getItem('userrole')?.toLowerCase().trim() || '';
this.count()
this.Fav()

  if (this.username) {
    this.isLoggedIn = true;  
  } else {
    this.isLoggedIn = false; 
  }

    

window.addEventListener('cartChanged', this.handleCartChanged.bind(this));
  window.addEventListener('product_added', this.product_added.bind(this));
  window.addEventListener('FavouriteChanged', this.FavouriteChanged.bind(this));
}

ngOnDestroy(): void {
  window.removeEventListener('cartChanged', this.handleCartChanged);
  window.removeEventListener('product_added', this.handleCartChanged);
  window.removeEventListener('FavouriteChanged', this.handleCartChanged);
}


product_added(event: Event): void {
  this.count();
}
FavouriteChanged(event: Event): void {
  this.Fav();
}
handleCartChanged(event: Event): void {
  this.count();
}

 


 searchProducts(event: KeyboardEvent): void {
    const query = (event.target as HTMLInputElement).value;
    console.log('Search query:', query);
  }

  logout(): void {
    this.route.navigate(['/log']);
    this.toastr.success('Logout Successfully');
    this.isLoggedIn = false;  
   sessionStorage.clear();  
  }
viewProfile() {
  console.log('Current this.id:', this.id);  
  if (this.id) {
    this.route.navigate(['/dash/view_p', this.id]);
    console.log('Navigating to view profile with ID:', this.id);
  } else {
    console.warn('ID is missing!');
  }
}
  addItem(){
this.route.navigate(['/dash/add']).catch(err => console.error('Navigation error:', err));
  }

  cart(){
    this.route.navigate(['/dash/cart']).catch(err => console.error('Navigation error:', err));
  }


  
home(){
  this.route.navigate(['/dash/home']).catch(err => console.error('Navigation error:', err));
}
favorite() {
  this.route.navigate(['/dash/fav']).catch(err => console.error('Navigation error:', err));
}
  
  count() {
    this.http.get<any[]>('http://localhost:3000/Cart').subscribe(
      (data) => {
        this.cartCount = data.length;  
        console.log('Cart count (number of products):', this.cartCount);
      },
      (error) => {
        console.error('Error fetching cart data:', error);
        this.cartCount = 0;
      }
    );
  }

Favourite:number=0

  
  Fav() {
    this.http.get<any[]>('http://localhost:3000/Favorite').subscribe(
      (data) => {
        this.Favourite = data.length;  
        console.log('Cart count (number of Favourite products):', this.Favourite);
      },
      (error) => {
        console.error('Error fetching cart data:', error);
        this.Favourite = 0;
      }
    );
  }
}


 


 

 