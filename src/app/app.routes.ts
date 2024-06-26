import { Routes } from '@angular/router';
import { HomeComponent } from './home-components/home/home.component';
import { ProfileComponent } from './profile-components/profile/profile.component';
import { ProfileInformationComponent } from './profile-components/profile-information/profile-information.component';
import { ProfileInformationInfoComponent } from './profile-components/profile-information-info/profile-information-info.component';
import { ShopComponent } from './Components/shop/shop.component';
import { ProductDetailsComponent } from './Components/product-details/product-details.component';
import { AdminDashboardComponent } from './Components/Admin/admin-dashboard/admin-dashboard.component';
import { AddProductComponent } from './Components/Admin/add-product/add-product.component';
import { AdminManageUsersComponent } from './Components/Admin/admin-manage-users/admin-manage-users.component';
import { DisplayUserDetailsComponent } from './Components/Admin/display-user-details/display-user-details.component';
import {
  AdminAuthGuard,
  AuthGuardService,
} from './Services/auth-guard.service';
import { LoginComponent } from './login/login.component';

import { OrderDetailsComponent } from './Components/order-details/order-details.component';
import { OrdersHistoryComponent } from './Components/orders-history/orders-history.component';
import { CartComponent } from './Components/cart/cart.component';
import { CheckoutComponent } from './Components/checkout/checkout.component';
import { SignupComponent } from './signup/signup.component';
import { WishListComponent } from './Components/wish-list/wish-list.component';
import { ContactUsComponent } from './contactus/contactus.component';
import { AboutUsComponent } from './Components/about-us/about-us.component';
import { VerificationComponent } from './verification/verification.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      { path: 'email', component: ProfileInformationComponent },
      {
        path: 'info',
        component: ProfileInformationInfoComponent,
      },
      {
        path: 'orders',
        component: OrdersHistoryComponent,
      },
      {
        path: 'orders/:id',
        component: OrderDetailsComponent,
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'products',
    children: [
      { path: '', component: ShopComponent },
      { path: ':id', component: ProductDetailsComponent },
      { path: 'category/:category', component: ShopComponent },
    ],
  },
  {
    path: 'admin',
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        component: AdminDashboardComponent,
      },
      {
        path: 'products',
        children: [
          { path: '', component: ShopComponent },
          { path: 'add', component: AddProductComponent },
          { path: 'edit/:id', component: AddProductComponent },
          { path: ':id', component: ProductDetailsComponent },
        ],
      },
      {
        path: 'users',
        children: [
          {
            path: '',
            canActivate: [AuthGuardService],
            component: AdminManageUsersComponent,
          },
          {
            path: ':id',
            canActivate: [AuthGuardService],
            component: DisplayUserDetailsComponent,
          },
        ],
      },
      {
        path: 'orders',
        children: [
          {
            path: '',
            canActivate: [AuthGuardService],
            component: OrdersHistoryComponent,
          },
          {
            path: ':id',
            canActivate: [AuthGuardService],
            component: OrderDetailsComponent,
          },
        ],
      },
    ],
  },

  // TODO: add the error component
  // { path: '**', component: ErrorComponent },

  { path: 'orders', redirectTo: 'profile/orders' },
  { path: 'orders/:id', redirectTo: 'profile/orders/:id' },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'wishlist', component: WishListComponent },
  {
    path: 'contactus',
    component: ContactUsComponent,
  },
  { path: 'aboutus', component: AboutUsComponent },
  { path: 'verify', component: VerificationComponent },
];
