import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  profileForm: FormGroup;
  profileImageUrl: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder,private router: Router) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      email: ['', [Validators.required, Validators.email]],
      name: [''],
      mobile: ['', [Validators.pattern('\\+91[0-9]{10}')]],
      gender: [''],
      role: [''],
      street: [''],
      city: [''],
      state: [''],
      pincode: ['', [Validators.pattern('[0-9]{6}')]],
      country: ['']
    })
  }

onFileSelect(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    // You can add logic here to update the profile picture preview or upload the file
    // For example, to show a preview:
    const reader = new FileReader();
    reader.onload = () => {
      // Assuming you have a property like profileImageUrl to bind to the <img> src
      this.profileImageUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}


onSubmit(): void {
  if (this.profileForm && this.profileForm.valid) {
    // Handle form submission logic here, e.g., send data to API
    console.log('Profile form submitted:', this.profileForm.value);
  }
}

  
 
  goBack() {
    // Navigate based on role
    const role = this.profileForm.get('role')?.value?.toLowerCase();
    if (role === 'admin') {
      this.router.navigate(['/admin_dashboard']);
    } else if (role === 'user') {
      this.router.navigate(['/user_dashboard']);
    } else {
      this.router.navigate(['/']); // Fallback route
    }
  }
  myOrders(){
    this.router.navigate(['dash/my_orders']);
  }

}
