import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import{MatButtonModule} from '@angular/material/button';
import{MatCardModule} from '@angular/material/card';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import{MatToolbarModule}from '@angular/material/toolbar'
import{MatSidenavModule}from '@angular/material/sidenav';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './home/home.component';
import{MatIconModule} from '@angular/material/icon';
import{MatFormFieldModule} from '@angular/material/form-field';
import{MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import{MatRadioModule}from '@angular/material/radio'
import { HttpClientModule } from '@angular/common/http';
import{MatListModule} from '@angular/material/list';
import { AddItemComponent } from './add-item/add-item.component';
import{MatSelectModule} from '@angular/material/select';
import { ProductComponent } from './product/product.component';
import { SearchPipe } from './search.pipe';
import { ProductdetailsComponent } from './productdetails/productdetails.component';
import{MatDialogModule}from '@angular/material/dialog';
import { LoginComponent } from './login/login.component';
import { RegComponent } from './reg/reg.component';
import { MasterComponent } from './master/master.component';
import { AdminRegisterationComponent } from './admin-registeration/admin-registeration.component'
import { ToastrModule } from 'ngx-toastr';
import{MatTooltipModule}from '@angular/material/tooltip';
import { ProfileComponent } from './profile/profile.component'
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { UserCompComponent } from './user-comp/user-comp.component';
import { ViewprofileComponent } from './viewprofile/viewprofile.component';
import { MarketComponent } from './market/market.component';
import { CartComponent } from './cart/cart.component';              
import { MatBadgeModule } from '@angular/material/badge';
import { MatGridListModule } from '@angular/material/grid-list';
import { FavoriteComponent } from './favorite/favorite.component';
import { OrganicProductComponent } from './organic-product/organic-product.component';
import { MatChipsModule } from '@angular/material/chips';
import { UserProductDetailsComponent } from './user-product-details/user-product-details.component';
 import { CheckoutComponent } from './checkout/checkout.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { OrderComponent } from './order/order.component';
 // import { OrderComponent } from './orders/orders.component'; // Removed to avoid duplicate identifier error
import {MatCheckboxModule} from '@angular/material/checkbox';
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HomeComponent,
    AddItemComponent,
    ProductComponent,
    SearchPipe,
    ProductdetailsComponent,
    LoginComponent,
    RegComponent,
    MasterComponent,
    AdminRegisterationComponent,
    ProfileComponent,
    EditProfileComponent,
    UserCompComponent,
    ViewprofileComponent,
    MarketComponent,
    CartComponent,
  FavoriteComponent,
  OrganicProductComponent,
  UserProductDetailsComponent,
  OrderComponent,
  CheckoutComponent
],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    HttpClientModule,
    MatListModule,
    MatSelectModule,
    MatDialogModule,
    ToastrModule.forRoot(),
    MatTooltipModule,
    MatMenuModule,
    MatBadgeModule,
    MatGridListModule,
    MatSnackBarModule,
    MatChipsModule,
    MatDividerModule,
    MatExpansionModule,
    MatCheckboxModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
