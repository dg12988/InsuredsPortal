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
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username:string;
  password:string;
  private cookieName: string;
  private cookiePass: string;
  private rememberCookie;
  public authPassed:boolean = false;
  public isRememberMe = false;

  @ViewChild ('userNameField') userNameField;

  parentParam="5511967";

  constructor(private cookieService: CookieService) {}

  ngOnInit(): void {
  
    this.stayLoggedIn();

    
  }

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
