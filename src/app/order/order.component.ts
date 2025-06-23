import { HttpClient } from '@angular/common/http';
import { Component, Inject, Optional } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import emailjs from 'emailjs-com';


interface CartItem {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  quantity: number;
  selected: boolean;
  image: string;
  price: number;
}


interface OrderDialogData {
  cartItems?: CartItem[]
  total?: number;
}

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {
  paymentMethod: number = 0;
  cartItems:any[] = [];
  total: number = 0;

constructor(
  @Optional() @Inject(MAT_DIALOG_DATA) public data: OrderDialogData,
  @Optional() private dialogRef: MatDialogRef<OrderComponent>,
  private http: HttpClient
) {
  if (data) {
    this.cartItems = data.cartItems || [];
    this.total = data.total || 0;
  } else {
    this.cartItems = [];
    this.total = 0;
  }
}
sendConfirmationEmail(orderId: string, deliveryDate: string) {
  const emailPayload = {
    to: sessionStorage.getItem('email'),
    subject: 'Order Confirmation - ' + orderId,
    body: `
      <h3>Thank you for your order!</h3>
      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Payment Method:</strong> ${this.paymentMethod}</p>
      <p><strong>Delivery Date:</strong> ${new Date(deliveryDate).toDateString()}</p>
    `
  };

  this.http.post<any>('http://localhost:3000/send-email', emailPayload).subscribe({
    next: () => console.log('📧 Confirmation email sent'),
    error: err => console.error('❌ Failed to send confirmation email:', err)
  });
}


  // confirmOrder() {
  //   const orderId = 'ORD' + Date.now();

  //   this.cartItems.forEach((item, index) => {
  //     const payload = {
  //       "0": {
  //         id: item.id,
  //         userId: item.userId,
  //         productId: item.productId,
  //         quantity: item.quantity,
  //         productName: item.productName,
  //         selected: item.selected
  //       },
  //       Orderid: orderId
  //     };

  //     this.http.post<any>('http://localhost:3000/Confirmed', payload).subscribe({
  //       next: () => {
  //         if (index === this.cartItems.length - 1) {
  //           alert('Order placed successfully!');
  //           if (this.dialogRef) this.dialogRef.close();
  //         }
  //       },
  //       error: (err) => {
  //         console.error('Failed to confirm order:', err);
  //         alert('Failed to place order. Please try again.');
  //       }
  //     });
  //   });

  //   console.log('Submitted Order Items:', this.cartItems);
  // }



//   confirmOrder() {
//   const orderId = 'ORD' + Date.now();
//   const orderDate = new Date().toISOString(); // current date & time
//   const deliveryDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(); // +2 days

//   this.cartItems.forEach((item, index) => {
//     const payload = {
//       "0": {
//         id: item.id,
//         userId: item.userId,
//         productId: item.productId,
//         quantity: item.quantity,
//         productName: item.productName,
//         selected: item.selected
//       },
//       Orderid: orderId,
//       orderDate: orderDate,
//       deliveryDate: deliveryDate,
//       paymentMethod: this.paymentMethod
//     };

//     this.http.post<any>('http://localhost:3000/Confirmed', payload).subscribe({
//       next: () => {
//         if (index === this.cartItems.length - 1) {
//           alert('Order placed successfully!');

//           // 🔔 Send confirmation email
//           this.sendConfirmationEmail(orderId, deliveryDate);

//           if (this.dialogRef) this.dialogRef.close();
//         }
//       },
//       error: (err) => {
//         console.error('Failed to confirm order:', err);
//         alert('Failed to place order. Please try again.');
//       }
//     });
//   });

//   console.log('Submitted Order Items:', this.cartItems);
// }
 confirmOrder() {
  const orderId = 'ORD' + Date.now();
  const orderDate = new Date().toLocaleString();
  const deliveryDate = new Date(Date.now() + 2 * 86400000).toLocaleDateString(); // 2 days from now
  const email = sessionStorage.getItem('email') || 'test@example.com';

  this.cartItems.forEach((item, index) => {
    const payload = {
      "0": {
        id: item.id,
        userId: item.userId,
        productId: item.productId,
        quantity: item.quantity,
        productName: item.productName,
        selected: item.selected,
        image: item.image,
        price: item.mrp
      },
      Orderid: orderId
    };

    this.http.post<any>('http://localhost:3000/Confirmed', payload).subscribe({
      next: () => {
        // Once last item is posted, send the email
        if (index === this.cartItems.length - 1) {
          const templateParams = {
            order_id: orderId,
            email: email,
            delivery_date: deliveryDate,
            order_date: orderDate,
            cost: {
              shipping: '20',
              tax: '0',
              total: this.total.toFixed(2)
            },
            orders: this.cartItems.map((item: any) => ({
              name: item.productName,
              price: item.mrp,
              units: item.quantity,
              image_url: item.image.startsWith('http') ? item.image : `https://yourdomain.com/${item.image}`,
              logo: 'https://th.bing.com/th/id/OIP.ZQQq0DuntCMOIL2gWmcvfwHaE8?rs=1&pid=ImgDetMain&cb=idpwebp2&o=7&rm=3'
            }))
          };

          emailjs.send(
            'service_5nbl5ps',     // ✅ Your EmailJS service ID
            'template_grqv0k7',    // ✅ Your EmailJS template ID
            templateParams,
            'sIe9Jzaeewyier2HU'    // ✅ Your EmailJS public key
          ).then(() => {
            alert('Order placed and confirmation email sent!');
            if (this.dialogRef) this.dialogRef.close();
          }).catch(err => {
            console.error('Email sending failed:', err);
            alert('Order placed but email sending failed.');
            if (this.dialogRef) this.dialogRef.close();
          });
        }
      },
      error: (err) => {
        console.error('Failed to confirm order:', err);
        alert('Failed to place order. Please try again.');
      }
    });
  });

  console.log('Submitted Order Items:', this.cartItems);
}




  cancel() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
