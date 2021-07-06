<!-- Component is designed to allow for authentication through server side valadation. This authentication section has been removed for security, and it's been replaced with a hardcoded version. -->

import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service'; 
import {ViewChild, ViewChildren} from '@angular/core';
import { ChangeDetectionStrategy } from '@angular/core';
import {style, state, animate, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [   // :enter is alias to 'void => *'
        style({opacity:0}),
        animate(300, style({opacity:1})) 
      ]),
      transition(':leave', [   // :leave is alias to '* => void'
        animate(0, style({opacity:0})) 
      ])
    ])
  ],
//   Using OnPush for performance
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

//   Variable Declaration
  username:string;
  password:string;
  private cookieName: string;
  private cookiePass: string;
  private rememberCookie;
  public authPassed:boolean = false;
  public isRememberMe = false;

  @ViewChild ('userNameField') userNameField;

//   Hardcoded Param for Portfolio
  parentParam="5511967";

  constructor(private cookieService: CookieService) {}

  ngOnInit(): void {
  
//     Start cookie service to allow user to say logged in on reload
    this.stayLoggedIn();

    
  }

  
//   Adds cookies for Remember me and sets username and password in another cookie. Deletes cookie if remember me is not selected
  LoginUser(){
       
    if(this.userNameField.nativeElement.value.toUpperCase() == "ADMIN" && this.password == "admin1234"){

      this.username = this.userNameField.nativeElement.value;

      if(this.isRememberMe === true){
        this.cookieService.set('username', this.username);
        this.cookieService.set("password", this.password);
      }
      else{
        this.cookieService.delete('username');
        this.cookieService.delete('password');
      }

      this.cookieService.set('remember', this.isRememberMe.toString());
      
      this.authPassed = true;
      
    }
    else{
      alert("The Username or Password is Incorrect.");
    }
  }

  stayLoggedIn(){


    this.cookieName = this.cookieService.get('username');
    this.cookiePass = this.cookieService.get('password');
    
  
    if(this.cookieName.toUpperCase() == "ADMIN" && this.cookiePass == "admin1234"){
      this.authPassed = true;
    }

   this.rememberCookie = this.cookieService.get('remember');
   
  
    
  if(this.rememberCookie && this.userNameField){  
     setTimeout(() => {
     
  
        this.userNameField.nativeElement.value = this.cookieName;
   
   
     }, 50);
    
  }
    

  }

 rememberMe(event: any){
    this.isRememberMe = event.checked;
    
    
 }
      

 


}
