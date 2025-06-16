import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ServiceService } from '../service.service';
import { AddItemComponent } from '../add-item/add-item.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-productdetails',
  templateUrl: './productdetails.component.html',
  styleUrls: ['./productdetails.component.css']
})
export class ProductdetailsComponent {
  Details:any=[]
  info:any=[]
  constructor(public ar:ActivatedRoute,public http:HttpClient,public dialog:MatDialog,public ss:ServiceService,public toastr:ToastrService,public route:Router){
    this.ar.params.subscribe((res)=>{
      this.Details=res
    })

  }



  ngOnInit() {
  this.ar.paramMap.subscribe((params: ParamMap) => {
    const id = params.get('id');
    if (id) {
      this.http.get(`http://localhost:3000/vegitable/${id}`).subscribe(res => {
        this.info = res;
      });
    }
  });
}
 
  getDetails(){
    this.http.get("http://localhost:3000/vegitable/"+this.Details.id).subscribe((res)=>{
      this.info=res;

    })
  }
  delete(id:any){
    this.http.delete(`http://localhost:3000/vegitable/${id}`).subscribe((res)=>{
    })
  }
  edit(info:any){
    this.dialog.open(AddItemComponent,{
      width:'70%',
      height:'100%',
      data:this.info
    }).afterClosed().subscribe(val=>{if(val==='Update'){
      this.getDetails()
    }})
    this.toastr.warning('Now Edit your Products')

  }

  
   

}
