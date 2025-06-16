import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-product-details',
  templateUrl: './user-product-details.component.html',
  styleUrls: ['./user-product-details.component.css']
})
export class UserProductDetailsComponent {
  constructor(public http:HttpClient,public route:ActivatedRoute,public toastr:ToastrService,public router:Router){}

Search: string = '';

productId:any=[]
product: any;
  ngOnInit(): void {
  this.productId = this.route.snapshot.paramMap.get('id');
  if (this.productId) {
  this.http.get<any[]>('http://localhost:3000/vegitable').subscribe((products) => {
  this.product = products.find(p => p.id === this.productId);
  });
  }
  }
 cartItems: any[] = [];
   userId: any = sessionStorage.getItem('id');
productAddedSet = new Set<string>()
productAdded: boolean = false

addToCart(product: any) {
  const productId = product.productId;
  // Check server for existing item
  this.http.get<any[]>(`http://localhost:3000/Cart?userId=${this.userId}&productId=${productId}`).subscribe(existing => {
    if (existing.length > 0) {
      this.toastr.info('Product already in cart.');
        this.router.navigate(['/dash/cart']); // Navigate to cart after adding

      return;
    }
    const cartItem = {
      userId: this.userId,
      productId: productId,
      quantity: 1,
      productName: product.productName,  // Ensure correct casing
      price: product.price,
      mrp: product.mrp,
      image: product.imageUrl
    };
    this.http.post('http://localhost:3000/Cart', cartItem).subscribe({
      next: (response) => {
        window.dispatchEvent(new Event('product_added'));
        console.log('Cart item saved to server:', response);
        this.toastr.success('Product added to cart.');
        this.productAddedSet.add(productId); // Add to set after success
        this.router.navigate(['/dash/cart']); // Navigate to cart after adding
      },
      error: (error) => {
        console.error('Failed to save item to server:', error);
        this.toastr.error('Could not sync cart with server.');
      }
    });
  });
}




}
