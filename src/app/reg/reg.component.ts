import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reg',
  templateUrl: './reg.component.html',
  styleUrls: ['./reg.component.css']
})
export class RegComponent {
  role=[{value:'Admin',viewvalue:'admin'},{value:'User',viewvalue:'user'}]

  constructor(public fb:FormBuilder,public http:HttpClient,public router:Router){}
  registerForm = this.fb.group({
    username:this.fb.control('',Validators.compose([Validators.required]),[this.isUserUnique.bind(this)]),
    password:this.fb.control('',Validators.compose([Validators.required,Validators.pattern('^(?=.*[A-Z])(?=.*[0-9])(?=.*[a-z]).{8,}$')])),
    email:this.fb.control('',Validators.compose([Validators.required,Validators.email]),[this.isemailUnique.bind(this)]),
    gender:this.fb.control('',Validators.required),
    role:this.fb.control('user'),
    isactive:this.fb.control(true),

  })
  proceedRegistration(){
    if(this.registerForm){
      this.http.post("http://localhost:3000/user",this. registerForm.value).subscribe({
        next:(res)=>{
          console.log(res)
          alert('Details Added Succesfully')
          this.registerForm.reset();
          this.router.navigate(['/log'])
          alert("go and check it ")
        },error:(err)=>{
          alert("error while adding details")

        }
      })
    } 
  }
  isUserUnique(fc:any):Promise<any>{
    var p = new Promise((resolve,reject)=>{
      this.http.get(`http://localhost:3000/user?username=${fc.value}`).subscribe((data:any)=>{
        if(data['length']!==0){
          resolve({userExistError:'course already exist'})
        }
        else{
          resolve(null)
        }
      })
    })
    return p
  }
  isemailUnique(fc:any):Promise<any>{
    var p = new Promise((resolve,reject)=>{
      this.http.get(`http://localhost:3000/user?email=${fc.value}`).subscribe((data:any)=>{
        if(data['length']!==0){
          resolve({emailExistError:'course already exist'})
        }
        else{
          resolve(null)
        }
      })
    })
    return p
  }









}
