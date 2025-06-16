import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-viewprofile',
  templateUrl: './viewprofile.component.html',
  styleUrls: ['./viewprofile.component.css']
})

export class ViewprofileComponent implements OnInit {
  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }
id: string | null = null;
user: any;
username: string | null = null;


 


ngOnInit(): void {
  this.id = this.route.snapshot.paramMap.get('id');
  if (this.id) {
 this.http.get(`http://localhost:3000/users/${this.id}`).subscribe({
  next: (data) => {
 this.user = data;
  console.log('User data:', this.user);
 },error: (err) => {
  console.error('Error fetching user:', err);
  console.error('Status:', err.status);
  console.error('Message:', err.message);
}
 });
  }
}
basket() {
  const role = sessionStorage.getItem('userrole')?.toLowerCase().trim();

  if (role === 'admin') {
    this.router.navigate(['/dash/product']);
  } else if (role === 'user') {
    this.router.navigate(['/dash/user']);
  } else {
    console.warn('Unknown user role:', role);
  }
}

}



 