import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ServiceService } from '../service.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.css']
})
// export class MasterComponent implements OnInit {
//   constructor(public fb:FormBuilder,public http:HttpClient,public route:Router,public ss:ServiceService,public toastr:ToastrService){
//   }



export class MasterComponent implements OnInit {
  constructor(
    public fb: FormBuilder,
    public http: HttpClient,
    public route: Router,
    public ss: ServiceService,
    public toastr: ToastrService
  ) {
    // window.localStorage.clear(); // Remove or comment out this line
  }

  MasterForm: FormGroup;
  master: any = {};

  ngOnInit(): void {
    this.MasterForm = this.fb.group({
      MasterKey: new FormControl('', Validators.required)
    });
  }

  submit() {
    if (this.MasterForm.invalid) {
      this.toastr.error('Please enter the master key', 'Validation Error');
      return;
    }

    this.ss.getMasterpassword(1).subscribe({
      next: (res) => {
        this.master = res;
        if (this.master.password === this.MasterForm.value.MasterKey) {
          window.localStorage.setItem('Industry', this.master.Industry);
          this.toastr.success('You entered the correct password', 'Hooray');
          this.route.navigate(['/ar']);
        } else {
          this.toastr.error('You entered an incorrect password', 'Are you Admin');
        }
      },
      error: (err) => {
        this.toastr.error('Failed to verify password', 'Error');
      }
    });
  }
}