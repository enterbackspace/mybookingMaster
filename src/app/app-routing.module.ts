import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddItemComponent } from './add-item/add-item.component';
import { ProductComponent } from './product/product.component';
import { ProductdetailsComponent } from './productdetails/productdetails.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegComponent } from './reg/reg.component';
import { MasterComponent } from './master/master.component';
import { AdminRegisterationComponent } from './admin-registeration/admin-registeration.component';
import { GuardGuard } from './guard.guard';
import { MasterGuard } from './master.guard';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { UserCompComponent } from './user-comp/user-comp.component';
import { ViewprofileComponent } from './viewprofile/viewprofile.component';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { OrganicProductComponent } from './organic-product/organic-product.component';
import { UserProductDetailsComponent } from './user-product-details/user-product-details.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';

const routes: Routes = [
 {
  path:'log',
  component:LoginComponent
},
  { path: '', pathMatch: 'full', redirectTo: '/log' },
  {path:'reg',component:RegComponent},
  
  {path:'master',component:MasterComponent
  },
  {path:'ar',component:AdminRegisterationComponent,
  canActivate:[MasterGuard]
},
  {
  path:'dash',
  component:DashboardComponent,
  canActivate:[GuardGuard],
  children:[
    {
      path:'product',
      component:ProductComponent
    },{
      path:'pd',
      component:ProductdetailsComponent
    }, 
    {path:'e_reg',component:EditProfileComponent},
    {
      path:'user',
      component:UserCompComponent
    },{
      path:'view_p/:id',
      component:ViewprofileComponent
    },
    {
      path:'add',
      component:AddItemComponent
    },{
    path:'cart',
    component:CartComponent
    },{
      path:'home',
      component:HomeComponent 
    },
    {
      path:'fav',
      component:FavoriteComponent
    },{
      path:'org',
      component:OrganicProductComponent
    },
    {
      path:'productdetails/:id',
      component:UserProductDetailsComponent
    },
    {
      path:'Checkout',
      component:CheckoutComponent
    },{
    path:'myOrders',
    component:MyOrdersComponent
    }
  ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
