import { Component } from '@angular/core';
import { ServiceService } from '../service.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  constructor(public ss:ServiceService,public toastr:ToastrService,public route:Router){}
  profile:any=[]
  email:any=[]
  username:any=[]
  role:any=[]
  ngOnInit(){
    this.profile=this.ss.getItem('profile')
this.email=this.ss.getItem('email')
this.username=this.ss.getItem('username')
this.role=this.ss.getItem('userrole')
  }
  logout(){
    sessionStorage.clear();
    this.toastr.warning('session storage clear','Log out')
    this.route.navigate(['/log'])

    
  }

}
