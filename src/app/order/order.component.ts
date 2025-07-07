import { HttpClient } from '@angular/common/http';
import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import emailjs from 'emailjs-com';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

interface CartItem {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  quantity: number;
  selected: boolean;
  image: string;
  price: number;
  paymentMethod: string;
  cardholderName: string;
  upiId: string;
  discount?: number;
}

interface OrderDialogData {
  cartItems?: CartItem[];
  total?: number;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {
  paymentMethod: string = '';
  cardholderName: string = '';
  upiId: string = '';
  cartItems: CartItem[] = [];
  total: number = 0;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: OrderDialogData,
    @Optional() private dialogRef: MatDialogRef<OrderComponent>,
    private http: HttpClient,
    public toastr: ToastrService
  ) {
    emailjs.init('-hxCOnvPijVM98oD9');
    if (data) {
      this.cartItems = data.cartItems || [];
      this.total = data.total || 0;
    }
  }

  groupCartItems(cartItems: any[]) {
    const grouped = new Map<string, any>();
    for (const item of cartItems) {
      const key = `${item.productId}_${item.userId}_${item.price}`;
      if (grouped.has(key)) {
        const existing = grouped.get(key);
        existing.quantity += item.quantity;
        existing.totalPrice += item.price * item.quantity;
      } else {
        grouped.set(key, {
          ...item,
          totalPrice: item.price * item.quantity
        });
      }
    }
    return Array.from(grouped.values());
  }

  checkAndUpdateMyOrder(item: any, orderId: string, orderDate: string, deliveryDate: string, deliveryTime: string, email: string) {
    const today = new Date().toDateString();

    return this.http.get<any[]>(`http://localhost:3000/myOrder?customerEmail=${email}&productId=${item.productId}`).pipe(
      switchMap(existingOrders => {
        const sameDayOrder = existingOrders.find(order => {
          const orderDay = new Date(order.orderDate).toDateString();
          return orderDay === today;
        });

        if (sameDayOrder) {
          const updatedQty = sameDayOrder.quantity + item.quantity;
          const updatedPrice = sameDayOrder.totalPrice + item.price * item.quantity;

          return this.http.patch(`http://localhost:3000/myOrder/${sameDayOrder.id}`, {
            quantity: updatedQty,
            totalPrice: updatedPrice
          });
        } else {
          const orderPayload = {
            ...item,
            orderId: orderId,
            orderDate: orderDate,
            deliveryDate: deliveryDate,
            deliveryTime: deliveryTime,
            paymentMethod: this.paymentMethod,
            totalPrice: item.price * item.quantity,
            customerEmail: email
          };
          return this.http.post('http://localhost:3000/myOrder', orderPayload);
        }
      })
    );
  }

  confirmOrder() {
    if (!this.paymentMethod) {
      this.toastr.warning('⚠️ Please select a payment method!');
      return;
    }

    if (this.paymentMethod === 'card' && (!this.cardholderName || !this.cardholderName.trim())) {
      this.toastr.warning('⚠️ Please enter the cardholder name!');
      return;
    }

    if (this.paymentMethod === 'upi' && (!this.upiId || !this.upiId.trim())) {
      this.toastr.warning('⚠️ Please enter your UPI ID!');
      return;
    }

    let totalMRP = 0;
    let totalDiscount = 0;

    this.cartItems.forEach(item => {
      totalMRP += item.price * item.quantity;
      totalDiscount += item.discount || 0;
    });

    let deliveryCharges = 0;
    let deliveryChargesDisplay = '₹0';

    if (this.paymentMethod === 'cash') {
      const confirmed = window.confirm('⚠️ ₹30 extra will be charged for Cash on Delivery. Continue?');
      if (!confirmed) {
        this.toastr.info('💡 You can switch to UPI or Net Banking to avoid the extra ₹30 charge.');
        return;
      }
      deliveryCharges = 30;
      deliveryChargesDisplay = '₹30';
      this.toastr.info('💰 ₹30 extra added for Cash on Delivery.');
    }

    const platformFee = 10;
    const totalPayable = totalMRP + deliveryCharges + platformFee;

    const orderId = 'ORD' + Date.now();
    const orderDate = new Date().toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const deliveryTimestamp = new Date();
    deliveryTimestamp.setDate(deliveryTimestamp.getDate() + 1);
    deliveryTimestamp.setHours(11, 0, 0, 0);

    const deliveryDate = deliveryTimestamp.toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });

    const deliveryTime = 'Before 11:00 AM';

    const email = sessionStorage.getItem('email')?.trim() || 'test@example.com';
    const customerName = sessionStorage.getItem('username')?.trim() || 'Customer';

    const confirmRequests = this.cartItems.map(item => {
      const payload = {
        id: item.id,
        userId: item.userId,
        productId: item.productId,
        quantity: item.quantity,
        productName: item.productName,
        selected: item.selected,
        image: item.image,
        price: item.price,
        Orderid: orderId
      };
      return this.http.post('http://localhost:3000/Confirmed', payload);
    });

    forkJoin(confirmRequests).subscribe({
      next: () => {
        const myOrderRequests = this.cartItems.map(item =>
          this.checkAndUpdateMyOrder(item, orderId, orderDate, deliveryDate, deliveryTime, email)
        );

        const deleteCartRequests = this.cartItems.map(item =>
          this.http.delete(`http://localhost:3000/orders/${item.id}`)
        );

        forkJoin([...myOrderRequests, ...deleteCartRequests]).subscribe({
          next: () => {
            const templateParams = {
              order_id: orderId,
              email: email,
              customer_name: customerName,
              customer_email: email,
              order_date: orderDate,
              delivery_date: deliveryDate,
              delivery_time: deliveryTime,
              cost: {
                mrp: totalMRP.toFixed(2),
                discount: totalDiscount.toFixed(2),
                delivery_charges: deliveryChargesDisplay,
                platform_fee: platformFee.toFixed(2),
                total: totalPayable.toFixed(2)
              },
              orders: this.cartItems.map(item => ({
                name: item.productName,
                price: (item.price * item.quantity).toFixed(2),
                units: item.quantity,
                image_url: item.image.startsWith('http')
                  ? item.image
                  : `https://yourdomain.com/${item.image}`
              }))
            };

            emailjs.send(
              'service_40f5dhl',
              'template_yjlqa3i',
              templateParams,
              '-hxCOnvPijVM98oD9'
            ).then(() => {
              this.toastr.success('✅ Order placed and confirmation email sent!');
              if (this.dialogRef) this.dialogRef.close();
            }).catch(err => {
              console.error('❌ Email sending failed:', err);
              this.toastr.error('⚠️ Order placed but email sending failed.');
              if (this.dialogRef) this.dialogRef.close();
            });
          },
          error: err => {
            console.error('❌ Failed to move to myOrder or delete cart:', err);
            this.toastr.error('⚠️ Order partially placed. Some items may not have been removed.');
            if (this.dialogRef) this.dialogRef.close();
          }
        });
      },
      error: err => {
        console.error('❌ Failed to confirm order items:', err);
        this.toastr.error('⚠️ Failed to confirm order. Please try again.');
        if (this.dialogRef) this.dialogRef.close();
      }
    });

    console.log('🛒 Submitted Order Items:', this.cartItems);
  }

  cancel() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
