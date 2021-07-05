import { BrowserModule } from '@angular/platform-browser';

import { NgModule, ApplicationRef } from '@angular/core';

import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';


import { AdjMapComponent } from './adjmap-app/adjmap-app';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule} from '@angular/material/slider';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatListModule} from '@angular/material/list';
import { ClaimFilterPipe } from './adjmap-app/filter.pipe';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthModule } from './auth/auth.module';

import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { LoginComponent } from './login/login/login.component';

import { CookieService } from 'ngx-cookie-service';
import { NgChatModule } from 'ng-chat';

 import {SafeHtmlPipe} from './adjmap-app/safehtml.pipe';
 import {SafePipe} from './adjmap-app/safe.pipe';
 
export class DemoMaterialModule {}
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCheckboxModule,
    MatRadioModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    HttpClientModule,
    MatSliderModule,
    MatButtonModule, 
    MatCardModule, 
    MatMenuModule, 
    MatToolbarModule, 
    MatIconModule, 
    MatAutocompleteModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatExpansionModule,
    MatSidenavModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    NgChatModule,
    MatListModule,
    MatTabsModule,
    DragDropModule, MatDatepickerModule, MatNativeDateModule, ReactiveFormsModule,
    MatTableModule,
    NgbModule,
 


  ],
  providers: [ClaimFilterPipe, CookieService],
  declarations: [ 
    AppComponent,
    AdjMapComponent,
    ClaimFilterPipe,
    SafeHtmlPipe,
    SafePipe,
    LoginComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}

