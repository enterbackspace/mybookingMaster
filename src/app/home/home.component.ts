import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  Vegitable: any[] = [];
  banners: string[] = [
    'https://im.whatshot.in/img/2020/Apr/istock-870915532-cropped-1587552820.jpg',
    'https://img.freepik.com/premium-photo/fresh-vegetables_922771-3043.jpg',
    // 'https://th.bing.com/th/id/OIP.24jk5MKcA05Sx439N3Wn5wAAAA?rs=1&pid=ImgDetMain',
    'https://th.bing.com/th/id/OIP.bypg4brZNYzkY4kzpRW0cAHaDu?rs=1&pid=ImgDetMain'
  ];

  constructor(private http: HttpClient,public route:Router) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/vegitable').subscribe({
      next: (data) => {
        this.Vegitable = data;
      },
      error: (err) => {
        console.error('Error fetching product data:', err);
      }
    });
  }

  Click(){
    this.route.navigate(['/dash/user']);
  }
}
