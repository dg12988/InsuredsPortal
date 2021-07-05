import { Component, ViewChild, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangeDetectionStrategy } from '@angular/core';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.Default

})
export class AppComponent{
  title: string = 'Claimswire Insured Portal';

  
  feedbackDialog(){
    window.open("https://web.simsol.com/eforms/claimswire-mapping-beta-feedback/61/","_blank");
  }
  onDone(){
    window.close();
    window.location.reload();
  }
}
  

