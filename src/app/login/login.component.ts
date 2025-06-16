import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from '../service.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  userData:any;
  user:any;


  ngOnInit(): void {
    sessionStorage.clear();
    window.localStorage.clear();
  }

  constructor(public fb:FormBuilder,public route:Router,public ss:ServiceService,public toastr:ToastrService ){
  }
  loginForm=this.fb.group({
    username:this.fb.control('',Validators.required),
    password:this.fb.control('',Validators.required)
  }) 


  log() { 
  if (this.loginForm.valid) {
    this.ss.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        const user = Array.isArray(res) ? res[0] : res;
        if (user) {
          sessionStorage.setItem('username', user.username);
          sessionStorage.setItem('userrole', user.role);
          sessionStorage.setItem('name', user.name || '');
          sessionStorage.setItem('email', user.email);
          sessionStorage.setItem('profile', user.profile || '');
          sessionStorage.setItem('id', user.id || '');
          sessionStorage.setItem('mobile', user.mobile || '');
sessionStorage.setItem('address', JSON.stringify(user.address));
          
          // Check user role and navigate accordingly
          if (user.role.toLowerCase() === 'admin') {
            this.route.navigate(['/dash/product']);
          } else if (user.role.toLowerCase() === 'user') {
            this.route.navigate(['/dash/home']);
          } else {
            this.toastr.warning("Invalid user role");
            return;
          }
          
          this.toastr.success("Login successful");
        } else {
          this.toastr.warning("Incorrect username or password");
        }
      },
      error: (err) => {
        this.toastr.error("Login failed. Please try again.");
        console.log(err);
      }
    });
  } else {
    this.toastr.warning('Please enter valid information');
  }
}


 
  
//   log() { 
//   if (this.loginForm.valid) {
//     this.ss.login(this.loginForm.value).subscribe({
//       next: (res: any) => {
//         const user = Array.isArray(res) ? res[0] : res;
//         if (user) {
//           sessionStorage.setItem('username', user.username);
//           sessionStorage.setItem('userrole', user.role);
//           sessionStorage.setItem('name', user.name || '');
//           sessionStorage.setItem('email', user.email);
//           sessionStorage.setItem('profile', user.profile || '');
//           sessionStorage.setItem('id', user.id || '');
//           this.route.navigate(['/dash/product']);
//           this.toastr.success("Login successfully");
//         } else {
//           this.toastr.warning("Incorrect username or password");
//         }
//       },
//       error: (err) => {
//         this.toastr.error("Login failed. Please try again.");
//       }
//     });
//   } else {
//     this.toastr.warning('Please enter valid information');
//   }
// }
}