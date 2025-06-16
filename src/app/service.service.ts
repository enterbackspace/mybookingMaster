import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  master="http://localhost:3000/masterPassword"
  apidetails="http://localhost:3000/user"
baseUrl='http://localhost:3000/register'
apide="http://localhost:3000/vegitable"

  constructor(public http:HttpClient,public route:Router) { }
  register(post:any){
  }
  get(){
    return this.http.get("http://localhost:3000/vegitable")
  }
  // update(inputdata:any,code:any){
  //   return this.http.put(this.apide+'/'+code,inputdata)
  // }

  update(product: any, id: string): Observable<any> {
    return this.http.put(`${this.apide}/${id}`, product);
  }
  // getBycode(username:any){
  //   return  this.http.get(this.apidetails+'/'+username)
  //   }
  getBycode(username: any) {
  return this.http.get(this.apidetails + '?username=' + encodeURIComponent(username));
}
    getMasterpassword(code:any){
      return this.http.get(this.master+'/'+code)
    }
    getItem(key: any)  {
      return sessionStorage.getItem(key);
    }
    isLoggedin(){
      return sessionStorage.getItem('username')!=null;
    }
    isMaster(){
      return window.localStorage.getItem('Industry')!=null;
    }
    login({username, password}: any) {
  return this.http.get(
    `http://localhost:3000/users?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  );
}
  

    }
