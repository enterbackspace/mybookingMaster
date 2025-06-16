import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddItemComponent } from '../add-item/add-item.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent {
constructor(public http:HttpClient,public dialog:MatDialog,public toastr:ToastrService){}
products:any=[]
Search:any=[]
ngOnInit(){
  this.http.get("http://localhost:3000/vegitable").subscribe((res)=>{ 
this.products=res})
}
 
}

