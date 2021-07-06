import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ViewChildren, ElementRef, destroyPlatform, QueryList, ContentChildren, ChangeDetectorRef, ContentChild} from '@angular/core';
import { Injectable, Renderer2, AfterViewInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ClaimAssignment } from '../model/claimAssignment.model';
import { InfoWindow, google } from '@agm/core/services/google-maps-types';
import { Adjuster } from '../model/adjuster.model';
import { MatButtonToggle } from '@angular/material/button-toggle';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatDatepicker, MatCalendar } from '@angular/material/datepicker';
import { MatInput } from '@angular/material/input';
import { MatListOption } from '@angular/material/list';
import { MatSelect } from '@angular/material/select';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatSlider } from '@angular/material/slider';
import { MatTableDataSource } from '@angular/material/table';
import { AgmMarker, AgmMap, MarkerManager, AgmCircle, AgmInfoWindow } from '@agm/core';
import * as XLSX from 'xlsx';
import { AgmSnazzyInfoWindowModule, AgmSnazzyInfoWindow } from '@agm/snazzy-info-window';
import { HttpHeaders } from '@angular/common/http'
import { ChangeDetectionStrategy } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import { FormControl } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { CookieService } from 'ngx-cookie-service'; 
import {DomSanitizer} from '@angular/platform-browser';
import {SafeHtmlPipe} from './safehtml.pipe';
import {SafePipe} from './safe.pipe';
import {style, state, animate, transition, trigger} from '@angular/animations';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { interval } from 'rxjs';
import { ChatAdapter, IChatController } from 'ng-chat';
import { DemoAdapter } from '../my-adapter/MyAdapter';






const API_KEY: string = [REDACTED];
//const CW_URL: string = 'http://192.168.2.122:3000/claims/';
const VI_SOURCE_URL = 'https://api.photoidapp.net/api/getVirtualInspection/';
const CW_URL: string = 'http://localhost:3000/assignment';
const CW_PUT_URL: string = 'https://claimswire-dev.simsol.com/ws-portal/contents';
const ADJ_URL: string = 'https://claimswire-dev.simsol.com/ws-portal/insured/';
const CONTENTS_URL_PART1: string = 'https://claimswire-dev.simsol.com/ws-portal/insured';
const CONTENTS_URL_PART2: string = 'contents';
//const ADJ_URL: string = 'http://localhost:4000/adjusters';
const GOOGLE_URL: string = "https://maps.googleapis.com/maps/api/geocode/json?address=";
const DIRECTIONS_URL: string="https://maps.googleapis.com/maps/api/directions/json?";
const GOOGLE_DIRECTIONS_URL: string ="https://www.google.com/maps/dir/?api=1&origin=";
const ROOMS_URL: string="http://localhost:2000/areas";

const isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);




@Component({
  selector: 'adjmap-app',
  providers: [],
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
 
  templateUrl: './adjmap-app.html',
  styleUrls: ['./adjmap-app.css'],
  
})
@Injectable()
export class AdjMapComponent implements OnInit {

  count$: Observable<number>;
  rows$: Observable<any[]>;

  // input arrays for JSON data  
  public contentsBaseRows = 0;
  public overallTotalItems = 1;
  public contentsDataArray: any[];
  public adjDataArray: Adjuster[];
  public contentsTotalItems = 0;
  public addRowAmount = 0;
  public isDataLoaded = false;
  public contentsData = [];
  public isDepAlerted = false;
  public saveDisabled = false;
  public loadedWorkbook;
  public totalClaimAmount = 0;
  public isLoading = false; 
  public color = 'primary';
  public mode = 'indeterminate';
  public value = 100;
  public logOutRequested: boolean = false;
  public runningExport;
  public saveButtonPress: boolean = false;
  public isSaved: boolean = false;
  public idleTimeoutClear;
  public checkedState = [false,false,false];
  public allCheckedTrue: boolean = false;
  public UOMSelected = "EA";
  public iconVisible: boolean = false;
  public contentsPreviewSelect: boolean = false;
  public contentsPreviewVisibility: boolean = false;
  public contentsPreviewTable;
  public finalContentsPrev: string = "";
  public contentsSubmitted: boolean = false;
  public contentsSubString: string = "";
  public contentsBgColor: string ="#fafaf9";
  public VIinfoArray;
  public VIinspectorLink="";
  public VIhomeownerLink="";
  public xlsxFileArray = [];
  public mainContentsDataArray = [];
  public maxContentsItemsPerGroup = 10;
  public isDashOpen = true;
  public isWizardOpen = false;
  public activeTab = 0; 
  public adjName;
  public isMessageOpen: boolean = false;
  public showClaimsProcess: boolean = true;

  private isInited;
  private createRows = [];
  public loadedContentsCounter = false;

  public userId = 999;
  public adapter: ChatAdapter = new DemoAdapter();
  // public totalUnreadMessages = 0;

  @ViewChild('ngChatInstance')
  protected ngChatInstance: IChatController;


  @Input('childParam') childParam: string;
  
  @ViewChild ('VirtualInspectionIframe') VirtualInspectionIframe;
  @ViewChild ('dataTable') dataTable;
  @ViewChild ('addRowAmount') addRowTotal;
  @ViewChild ('Save') Save;
  @ViewChild('load') load;
  @ViewChild('spinner') spinner;
  @ViewChild('contentsPrev') contentsPrev;
  @ViewChild('contentsShowPrev') contentsShowPrev;
  @ViewChild('video') videoElementRef: ElementRef;

  @ViewChildren ('roomInput') roomInput;
  @ViewChildren ('QTYInput') QTYInput;
  @ViewChildren ('UOMInput') UOMInput;
  @ViewChildren ('itemInput') itemInput;
  @ViewChildren ('ageInput') ageInput;
  @ViewChildren ('commentsInput') commentsInput;
  @ViewChildren ('makeInput') makeInput;
  @ViewChildren ('modelInput') modelInput;
  @ViewChildren ('serialInput') serialInput;
  @ViewChildren ('fromInput') fromInput;
  @ViewChildren ('costInput') costInput;
  @ViewChildren ('depInput') depInput;
  @ViewChildren ('totalInput') totalInput;
  @ViewChildren('tableRow') tableRow;
  
 constructor(private httpClient: HttpClient, private changeDetectorRef: ChangeDetectorRef, private route: ActivatedRoute, private cookieService: CookieService  ){
  interface Navigator {
    getUserMedia(
        options: { video?: boolean; audio?: boolean; }, 
        success: (stream: any) => void, 
        error?: (error: string) => void
        ) : void;
}

   
  }


  
  logOut(){

 
      
      this.cookieService.delete('password');
 

    this.logOutRequested = true;
      window.location.reload();


  }
  
 
  calcTotal(){
    this.totalClaimAmount = 0;
  // for(let x = 0; x < this.mainContentsDataArray[0].length; x++){
  //    this.totalClaimAmount = this.mainContentsDataArray[0][x][12];
  // }
    for(let i = 0; i < this.contentsTotalItems; i++){
      this.totalInput._results[i].nativeElement.value = (this.QTYInput._results[i].nativeElement.value * this.costInput._results[i].nativeElement.value).toFixed(2);
      
      this.totalClaimAmount += +(this.QTYInput._results[i].nativeElement.value * this.costInput._results[i].nativeElement.value).toFixed(2); 

    }  
  
  }

   // gets adjuster info from CW and subscribes it to adjDataArray
    getAdjInfo(){
     let adjParam = this.getParamValueQueryString("id");
    
    //Next line is future code allowing us to grab the id param from the login page. This will be used to create a static login page. 
    //let adjParam = this.childParam;
    
    this.httpClient.get(ADJ_URL + adjParam).subscribe((res: Adjuster[])=>{
      this.adjDataArray = res; 
      
      this.adjName = this.adjDataArray[0][0].adjusterName.split(",", 2); 
      
  
    });
  }
    // gets adjuster info from CW and subscribes it to adjDataArray
    getContentsInfo(){
      let adjParam = this.getParamValueQueryString("id");
      this.httpClient.get(CONTENTS_URL_PART1 + "/" + adjParam + "/" + CONTENTS_URL_PART2, { responseType: 'blob'}).subscribe((res: File)=>{
       
      
         this.loadXLSX(res);  

    
          
      });
    }

  //gets parameter name
  getParamValueQueryString( paramName ) {
    const url = window.location.href;
    let paramValue;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      paramValue = httpParams.get(paramName);
      
    }
    return paramValue;
  }
  goToLink(url: string){
    window.open(url, "_blank");
  }
  getVirtualInspection(){

    let VIemail = "doug.goldberg@me.com";
    let VIapi = "-MB61TCyRL8FCIk2367K"
    let VIid = "-MI16jfscFM0DeT9kkML"

    let VIbody = { 
        "email":  VIemail,
        "apiToken":  VIapi,
        "assignmentId": VIid
      }
          
   
    this.httpClient.post(VI_SOURCE_URL, VIbody).subscribe((res: Adjuster[])=>{
    this.VIinfoArray = res;
    console.log(res);
    this.VIinspectorLink = this.VIinfoArray.inspectorLink;
    this.VIhomeownerLink = this.VIinfoArray.homeOwnerLink;
  
    });
  }



  ngOnInit() {
    // this.isLoading = true;
  
    const getRows$: Observable<any[]> = of(this.createRows);
    
    this.rows$ = getRows$;

   

    this.getAdjInfo();

    this.getVirtualInspection();

    this.count$ = interval(1000)
    .pipe(
        map((count: number) => ++count)
    );

    
    let temp = this.cookieService.get('contentsSubmitted');

  if(temp === "true"){
    this.contentsSubmitted = true;
    this.contentsBgColor ="white";
  }
  else{
    this.contentsSubmitted = false;
    this.contentsBgColor ="#fafaf9";
  }

   
   
    
    this.contentsTotalItems = 1;

    
   
     
  }

ngDoCheck(){
  // this.totalUnreadMessages = DemoAdapter.mockedParticipants[0].totalUnreadMessages;
}
ngAfterContentInit(){
  setTimeout(() => {
    this.isLoading = false;

    console.log(this.ngChatInstance);
    this.ngChatInstance.triggerOpenChatWindow(DemoAdapter.mockedParticipants[0]);
    // this.totalUnreadMessages = DemoAdapter.mockedParticipants[0].totalUnreadMessages;
  }, 300);


   
  
}
  
  async startRecording() {
    navigator.getUserMedia(
    {video: true, audio: true}, 
    function (stream) { this.videoRecording = stream },
    function (error) {  }
);

  }

 
 async stopBothVideoAndAudio(stream) {
  stream.getTracks().forEach(function(track) {
      if (track.readyState == 'live') {
          track.stop();
      }
  });
}      


 nextTab(){

   this.activeTab++;
 }

 
  showWizard(){
  
  
    if(this.isWizardOpen === false){
      this.isWizardOpen = true;
      this.isDashOpen = false;
      this.isMessageOpen = false;
      this.showClaimsProcess = false;
      this.getContentsInfo();
    }


    
  
  }
  
  showDash(){
    if(this.isDashOpen === false){
      this.isWizardOpen = false;
      this.isMessageOpen = false;
      this.isDashOpen = true;
      this.showClaimsProcess = true;

      clearTimeout(this.runningExport);
      this.saveXLSX();
 
    }

  }
  showMessage(){
      this.isWizardOpen = false;
      // this.isDashOpen = false;
       this.ngChatInstance.triggerOpenChatWindow(DemoAdapter.mockedParticipants[0]);
      //  this.ngChatInstance.windows[0].isCollapsed = false;
     
      // DemoAdapter.mockedParticipants[0].totalUnreadMessages = 0;
     
      this.showClaimsProcess = true;
  }

  idleTimeout(event){
    if(event.type ==="mousemove"){
      clearTimeout(this.idleTimeoutClear);
      
    }
    
   this.idleTimeoutClear = setTimeout(() => { this.saveAndReload(); },900000);
  }
  
  saveAndReload(){
    this.exportXLSX();
    setTimeout(() => { this.logOut();}, 3000);
  }
  sizeIframe(obj){
    obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
  }

 messagesRead(){

  //  DemoAdapter.mockedParticipants[0].totalUnreadMessages = 0;
 }
 
 allChecked(event){
  
  
   if(event.checked === true){
    this.checkedState[event.source.value] = true;
   }
   else{
    this.checkedState[event.source.value] = false;
   }
  
   if(this.checkedState[0] === true && this.checkedState[1] === true && this.checkedState[2] === true && this.checkedState[3] === true){
      this.allCheckedTrue = true; 
      this.iconVisible = true;
      
   }
   else{
     this.allCheckedTrue = false;
     this.iconVisible = false;
   }
 }

  addRow(){
   
  
        this.addRowAmount = this.addRowTotal.nativeElement.valueAsNumber;
        this.contentsTotalItems += this.addRowAmount;
        this.createRows.length = this.contentsTotalItems;
        this.overallTotalItems++;
        

       
       
      


      
       
       
  
  }

  // // Load Contents Spreadsheet via GET
  public loadXLSX(res: File){
   
      // this.isLoading = true;
      this.readThis(res);
 

   
  }
  // For loading Contents Spreadsheet via event like button press
  // public loadXLSX(event: any){
  //   this.isLoading = true;
  //   this.readThis(event.target);
  // }

  public readThis(inputValue: any): void {
    let file: File = inputValue;
    
    
  
    if (file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || (file.name.substr(file.name.length - 4)) === "xlsx"){
          let myReader: FileReader = new FileReader();

        
          myReader.onload = (e: any) => {
            let data = new Uint8Array(e.target.result);

            let workbook = XLSX.read(data, {type: 'array'});
                      
            // load the workbook with the worksheet
            this.loadedWorkbook = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
          
            // create new rows/delete rows based on length of imported worksheet
            this.contentsTotalItems = this.loadedWorkbook.length;
            this.createRows.length = this.contentsTotalItems;
              // Fills input value with Loaded Workbook information. Timeout prevents conflict with additional rows populating from spreadsheet
              setTimeout(() => {
              
                for(let i = 0; i < this.contentsTotalItems; i++) { 
                 
                 
                  if(this.loadedWorkbook[i]['Room'] != undefined){
                    
                    this.roomInput._results[i].nativeElement.value = this.loadedWorkbook[i]['Room'];}
                  else
                    this.roomInput._results[i].nativeElement.value = "";
                  
                  if(this.loadedWorkbook[i]['Qty'] != undefined)
                    this.QTYInput._results[i].nativeElement.value = this.loadedWorkbook[i]['Qty']; 
                    
                  else
                    this.QTYInput._results[i].nativeElement.value = "";  
                  
                  if(this.loadedWorkbook[i]['Unit Of Measure'] != undefined)
                  this.UOMInput._results[i].nativeElement.value = this.loadedWorkbook[i]['Unit Of Measure']; 
                  else
                  this.UOMInput._results[i].nativeElement.value ="";
                  
                  if(this.loadedWorkbook[i]['Item Desc'] != undefined && this.loadedWorkbook[i]['Item Desc']!= "CW Contents Item"){
                    this.itemInput._results[i].nativeElement.value = this.loadedWorkbook[i]['Item Desc'];}
                    
                  else{
                    this.itemInput._results[i].nativeElement.value = "";
                  }  
                  
                  
                  if(this.loadedWorkbook[i]['Age Years'] != undefined)
                    this.ageInput._results[i].nativeElement.value = this.loadedWorkbook[i]['Age Years']; 
                  else
                    this.ageInput._results[i].nativeElement.value = "";
                  
                  if(this.loadedWorkbook[i]['Comments'] != undefined)
                    this.commentsInput._results[i].nativeElement.value = this.loadedWorkbook[i]['Comments']; 
                  else
                    this.commentsInput._results[i].nativeElement.value = "";
                  
                  if(this.loadedWorkbook[i]['Make'] != undefined)
                    this.makeInput._results[i].nativeElement.value = this.loadedWorkbook[i]['Make']; 
                  else
                    this.makeInput._results[i].nativeElement.value = "";
                  
                  if(this.loadedWorkbook[i]['Model'] != undefined)
                    this.modelInput._results[i].nativeElement.value = this.loadedWorkbook[i]['Model']; 
                  else
                    this.modelInput._results[i].nativeElement.value = "";
                  
                  if(this.loadedWorkbook[i]['Serial #'] != undefined)
                    this.serialInput._results[i].nativeElement.value = this.loadedWorkbook[i]['Serial #']; 
                  else
                    this.serialInput._results[i].nativeElement.value = "";
                  
                  if(this.loadedWorkbook[i]['Purchased From'] != undefined)
                    this.fromInput._results[i].nativeElement.value = this.loadedWorkbook[i]['Purchased From']; 
                  else
                    this.fromInput._results[i].nativeElement.value = "";
                  
                  if(this.loadedWorkbook[i]['Estimated Unit Cost'] != undefined)
                    this.costInput._results[i].nativeElement.value = this.loadedWorkbook[i]['Estimated Unit Cost'];  
                  else
                    this.costInput._results[i].nativeElement.value = "";
                  
                  //Removed code because field is no longer input by Insured  

                  // if(this.loadedWorkbook[i]['Dep%'] != undefined)
                  //   this.depInput._results[i].nativeElement.value = this.loadedWorkbook[i]['Dep%']; 
                  // else
                  //   this.depInput._results[i].nativeElement.value = "";
                  
                  if(this.loadedWorkbook[i]['Total Replacement Cost'] != undefined)
                    this.totalInput._results[i].nativeElement.value = this.loadedWorkbook[i]['Total Replacement Cost']; 
                  else
                    this.totalInput._results[i].nativeElement.value = (this.QTYInput._results[i].nativeElement.value * this.costInput._results[i].nativeElement.value).toFixed(2);
                }
               
                this.calcTotal();
                this.isLoading = false;
              }, 300);
          };

          myReader.readAsArrayBuffer(file);
          


      }

      else{
        alert("Import Failed! The file you've attempted to upload is not in XLSX format.");
      }
 
}

public saveXLSX(){

    this.saveButtonPress = true;
    clearTimeout(this.runningExport);
    this.exportXLSX();
} 

public exportXLSX() {

      
    this.tableToArray();
    
    this.runningExport = null;

}


public autoSaveXLSX(event){
    
  // When a change is made to any field in the contents inventory, it is checked if a previous autosave is running. If it is not running, an autosave is created. 
  // If it is running the original timeout is exited and a new autosave is created. This limits multiple saves in one period and allows for less strain on the server. Default 10 seconds per autosave. 
  
  if(this.runningExport == null || undefined)
  this.runningExport = setTimeout(()=>{this.exportXLSX();}, 10000);
  
  else{
    clearTimeout(this.runningExport);
    this.runningExport = setTimeout(()=>{this.exportXLSX();}, 10000);
  }

}

  

  elementToContentsArray(){
    let contentsData: string[][] = [];
    let emptyDesc = false;

  

    for(var i = 0; i < this.contentsTotalItems; i++) { 
  
      contentsData[i] = [];
     for(var j = 0; j < 13; j++){
         if(j === 0){    
            contentsData[i][j] = this.roomInput._results[i].nativeElement.value;
            this.roomInput._results[i].nativeElement.value = null;
          }
          if(j === 1){
            contentsData[i][j] = this.QTYInput._results[i].nativeElement.value; 
            this.QTYInput._results[i].nativeElement.value = null;
          }
         if(j === 2){
            contentsData[i][j] = this.UOMInput._results[i].nativeElement.value;
            this.UOMInput._results[i].nativeElement.value = null;
         }
          if(j === 3)
            if(this.itemInput._results[i].nativeElement.value != ""){
              contentsData[i][j] = this.itemInput._results[i].nativeElement.value;
              this.itemInput._results[i].nativeElement.value = null;
          } 
            else{
              contentsData[i][j] = "CW Contents Item";
              emptyDesc = true;}
         if(j === 4){
            contentsData[i][j] = this.ageInput._results[i].nativeElement.value; 
            this.ageInput._results[i].nativeElement.value = null;
         } 
        if(j === 5){
            contentsData[i][j] = this.commentsInput._results[i].nativeElement.value; 
            this.commentsInput._results[i].nativeElement.value = null;
        } 
        if(j === 6){
            contentsData[i][j] = this.makeInput._results[i].nativeElement.value; 
            this.makeInput._results[i].nativeElement.value = null;
        } 
        if(j === 7){
            contentsData[i][j] = this.modelInput._results[i].nativeElement.value; 
            this.modelInput._results[i].nativeElement.value = null;
        }
         if(j === 8){
            contentsData[i][j] = this.serialInput._results[i].nativeElement.value; 
            this.serialInput._results[i].nativeElement.value = null;
         }
         if(j === 9){
            contentsData[i][j] = this.fromInput._results[i].nativeElement.value; 
            this.fromInput._results[i].nativeElement.value = null;
         }
         if(j === 10){
            contentsData[i][j] = this.costInput._results[i].nativeElement.value; 
            this.costInput._results[i].nativeElement.value = null;
         }
            // The following two lines are to load the depreciation % per item. The insured does not know this info, so this is a deprecated feature at the moment

        //  if(j === 11)
        //     contentsData[i][j] = this.depInput._results[i].nativeElement.value; 
        
        // sets default Dep to 0
         if(j === 11){
            contentsData[i][j] = ""; 
         }
         if(j === 12){
            contentsData[i][j] = this.totalInput._results[i].nativeElement.value;
            this.totalInput._results[i].nativeElement.value = null;
         }   
           
    } 
 
    }


   

  
  }

  tableToArray(){
    
    let contentsData: string[][] = [];
    let contentsHeaders: string[] = ["Room","Qty","Unit Of Measure","Item Desc","Age Years","Comments","Make","Model","Serial #","Purchased From","Estimated Unit Cost","Dep%","Total Replacement Cost"] 
    let fileName = "SimsolContents.xlsx";
    let emptyDesc = false;

    for(var i = 0; i < this.contentsTotalItems; i++) { 
  
      contentsData[i] = [];
     for(var j = 0; j < 13; j++){
         if(j === 0)    
            contentsData[i][j] = this.roomInput._results[i].nativeElement.value;
         if(j === 1)
            contentsData[i][j] = this.QTYInput._results[i].nativeElement.value; 
         if(j === 2)
            contentsData[i][j] = this.UOMInput._results[i].nativeElement.value; 
         if(j === 3)
            if(this.itemInput._results[i].nativeElement.value != ""){
              contentsData[i][j] = this.itemInput._results[i].nativeElement.value;} 
            else{
              contentsData[i][j] = "CW Contents Item";
              emptyDesc = true;}
         if(j === 4)
            contentsData[i][j] = this.ageInput._results[i].nativeElement.value; 
         if(j === 5)
            contentsData[i][j] = this.commentsInput._results[i].nativeElement.value; 
         if(j === 6)
            contentsData[i][j] = this.makeInput._results[i].nativeElement.value; 
         if(j === 7)
            contentsData[i][j] = this.modelInput._results[i].nativeElement.value; 
         if(j === 8)
            contentsData[i][j] = this.serialInput._results[i].nativeElement.value; 
         if(j === 9)
            contentsData[i][j] = this.fromInput._results[i].nativeElement.value; 
         if(j === 10)
            contentsData[i][j] = this.costInput._results[i].nativeElement.value; 
        // The following two lines are to load the depreciation % per item. The insured does not know this info, so this is a deprecated feature at the moment

        //  if(j === 11)
        //     contentsData[i][j] = this.depInput._results[i].nativeElement.value; 
        
        // sets default Dep to 0
         if(j === 11)
            contentsData[i][j] = ""; 
         if(j === 12 && this.totalInput._results[i].nativeElement.value != undefined)
            contentsData[i][j] = this.totalInput._results[i].nativeElement.value; 

         
    } 

    }
    
  

    if(this.contentsPreviewSelect === true){

      this.mainContentsDataArray.push(contentsData[0]); 


      let worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(contentsData);
   
      worksheet.A1.v = "Room";
      worksheet.B1.v = "Qty";
      worksheet.C1.v = "Unit Of Measure";
      worksheet.D1.v = "Item Desc";
      worksheet.E1.v = "Age Years";
      worksheet.F1.v = "Comments";
      worksheet.G1.v = "Make";
      worksheet.H1.v = "Model";
      worksheet.I1.v = "Serial #";
      worksheet.J1.v = "Purchased From";
      worksheet.K1.v = "Estimated Unit Cost";
      worksheet.L1.v = "Dep%";
      worksheet.M1.v = "Total Replacement Cost";


     

      this.contentsPreviewTable = XLSX.utils.sheet_to_html(worksheet);
     
      let z:string = this.contentsPreviewTable;
        
    
 
   
      let rString = /xml:space="preserve"/gi;
      let qString = /t="s"/gi;
      let zString = /id="sjs-/gi;
      let fString = /<td/gi;
      let wString = /CW Contents Item/gi;      


      this.finalContentsPrev = z.replace(rString, "");

      let oneString = this.finalContentsPrev.replace(qString, "");
      let twoString = oneString.replace(zString, 'id="');
      let threeString = twoString.slice(83);
      let fourString = threeString.slice(0,-14);
      let fiveString = fourString.replace(fString, '<td style="font-size: 12px; padding: 10px;"');
      
      let sixString = fiveString.replace(/<table/gi, '<table style=" max-height: 700px;padding: 1%; background-color: white;"');
      let sevenString = sixString.replace(/<tr/, '<tr style="color: white;  font-size: 14px; background-color: black; font-family: "Montserrat";');
      let eightString = sevenString.replace(wString, "");
      // document.getElementById("testID").innerHTML = this.finalContentsPrev;
      // this.finalContentsPrev = "<div style='color: yellow;'>Test</div>";
      
      
      this.finalContentsPrev = eightString;
     
      
     
    }
    else{

    if(emptyDesc === true){
      alert("You are attempting to submit a Contents Spreadsheet that lacks one, or more, Item Description(s)." 
      + "\n\n" + "This is a required field, please ensure that you have entered an Item Description for every item. Any missing descriptions will not be calculated by your Adjusting Company." + "\n\n" +
       "This will result in a longer turn around for your claim.");
      
       return;    
    }
    


    
    let worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(contentsData);

    worksheet.A1.v = "Room";
    worksheet.B1.v = "Qty";
    worksheet.C1.v = "Unit Of Measure";
    worksheet.D1.v = "Item Desc";
    worksheet.E1.v = "Age Years";
    worksheet.F1.v = "Comments";
    worksheet.G1.v = "Make";
    worksheet.H1.v = "Model";
    worksheet.I1.v = "Serial #";
    worksheet.J1.v = "Purchased From";
    worksheet.K1.v = "Estimated Unit Cost";
    worksheet.L1.v = "Dep%";
    worksheet.M1.v = "Total Replacement Cost";
    
    /* generate workbook and add the worksheet */
     const wb: XLSX.WorkBook = XLSX.utils.book_new();
         
       XLSX.utils.book_append_sheet(wb, worksheet, 'Simsol Personal Property');
 
      /*Write workbook to arrayBuffer, must be type array, in order to convert to file later due to xlsx being a zip based container*/
      let xlFile = XLSX.write(wb, {type: "array", bookType: 'xlsx' });
     
      //convert worbook from arrayBuffer to File, type xlsx, do not attempt to change unless this is broken 
      let xlsxFile = new File([xlFile], "SimsolContents.xlsx", { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
      
      //get param from URL for ClaimUID and convert to JSON string
      let claimID =  this.getParamValueQueryString("id");
      let jsonData = JSON.stringify({"claimuid": claimID});

     // Create Form Data for multipart upload to server and append the json and xlsx(file) data
         let dataToSubmit = new FormData();
       
         dataToSubmit.append('json', jsonData);
     
         dataToSubmit.append('file', xlsxFile, "SimsolContents.xlsx");

        
         // sends to server via PUT
         this.serverPut(dataToSubmit); 
        
         
    }
    this.contentsPreviewSelect = false;
  }
 
  showContentsPreview(event){
   
    this.contentsPreviewSelect = true;
    this.contentsPreviewVisibility = true;

    this.tableToArray();
    }

  contentsPreviewClose(){
      this.contentsPreviewVisibility = false;


    }

  defaultMin(event){
   
    if(event.target.value === "" || event.target.value === null || event.target.value === undefined ){
        event.target.value = event.target.min;
    }
  }

  disableSave(){
    this.saveDisabled = true;
    setTimeout(() => {
      this.saveDisabled = false;
    }, 1000);
  }

  depAlert(event: any){
    if(this.isDepAlerted === false){
    alert('Depreciation will be determined by your Adjuster' + "\n" + 'Please leave this field blank');
    }

    this.isDepAlerted = true;
  }

  printWindow(){

    if(isIEOrEdge === false){
      window.print();
    }
    else{
      alert("Using Internet Explorer or Microsoft Edge will result in improper printing due to the browser's limitations. Please use Google Chrome or Mozilla Firefox to print.");
   
    }  
  }

  deleteRow(){
  if(this.contentsTotalItems > 0 ){
     this.contentsTotalItems--;
     this.overallTotalItems--;
  }
 
  this.createRows.length = this.contentsTotalItems;
  
 }

  finalSubmission(){
    this.contentsSubmitted = true;
    this.contentsSubString = "true";
    this.contentsBgColor ="white";
    this.cookieService.set('contentsSubmitted',this.contentsSubString);

  }
  onKeydown(event) {
    if (event.key === "Enter") {
     
    }
  }

  // Send Data to the Server
  serverPut(results: FormData){
    this.httpClient.put(CW_PUT_URL, 
         results,
         {headers: new HttpHeaders , responseType:'text' as 'json'})
        .subscribe(
            val => {
                console.log("PUT call successful", 
                            val);
            },
            response => {
                console.log("PUT call has an error", response);
            },
            () => {
                this.isSaved = true;
                console.log("The PUT observable is now completed.");
                 setTimeout(()=> this.isSaved = false, 4000);
            }
        );
 
  }

            
          

    }








