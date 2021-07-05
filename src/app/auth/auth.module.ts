import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './auth/components/login/login.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { ResetPasswordComponent } from './auth/components/reset-password/reset-password.component';



@NgModule({
  declarations: [LoginComponent, RegisterComponent, ResetPasswordComponent],
  imports: [
    CommonModule,
    AuthRoutingModule
  ],
  exports:[
    LoginComponent, 
    RegisterComponent, 
    ResetPasswordComponent
  ]
})
export class AuthModule { }
