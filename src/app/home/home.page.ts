import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Http,ResponseOptions,Headers } from '@angular/http';
import { AlertController,ModalController } from '@ionic/angular';
import { AutoCompleteModule } from 'ionic4-auto-complete';
import { map, reduce } from 'rxjs/operators';
import {Observable, of, empty} from 'rxjs';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { ReportModalPage } from '../report-modal/report-modal.page';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  title = 'angular-datatables';
  rows = [];
  temp = [];
  dataIn = [];
  resident = [];
  autocomplete = [];

  lecenseplate:any;
  description:any;
  inout:any = "in";

  val:any;
  dataid:any;

  status:any = "ผู้มาติดต่อ";
  data_room:any = "";
  variable:any;

  isItemAvailable:any;
  items:any;
  array = [];
  name_enterprise:any; 
  date:any;
  time:any;

  count:any;

  
  public enableSound = true;
  private clickSound = new Audio("data:audio/mpeg;base64,//sQxAAAA+i5OrQRABC9mG+3BCAACCAH/f//yE5z0Od/yf//ITnO853/O9CEIygAgEPg+8AAUWCwVioVCAEBgAAD/65xat0KnkqrfOEKkxfjOI6H//Ofpf/q8jZTBgc8uM4jcsMMMMH/+xLEAgAE6M1XGCKAAAAANIOAAAQIAADL6BfAW9DeJCI78xlb/EWEVL/6REV//0Uw0SMb//AY4ypMQU1FMy45OS4zqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo="
  );
  public soundEnabled = true;
  
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  constructor(public modalController: ModalController,private storage: Storage, private router: Router, public alertController: AlertController,private http: Http, public keyboard : Keyboard) {
    this.storage.get('key').then((val) => {
      //console.log('Your key is', val);
      this.getInout(val);
      this.val = val;
        this.getResident(val);
    });
    this.storage.get('name_enterprise').then((val) => {
      this.name_enterprise = val;
      //console.log('Your name_enterprise is', val);
    });
    this.isItemAvailable = false; // initialize the items with false
    setInterval(() => {
      this.getTime();
    }, 1000);
  }
  
  async presentModal() {
    const modal = await this.modalController.create({
      component: ReportModalPage
    });
    return await modal.present();
  }

  getTime(){
    //this.time = new Date();
    //this.date = date("H:i:s",date);
    let now = new Date();

    var thday = new Array ("อาทิตย์","จันทร์",
    "อังคาร","พุธ","พฤหัส","ศุกร์","เสาร์");
    var thmonth = new Array ("ม.ค.","ก.พ.","มี.ค.",
    "เม.ย.","พ.ค.","มิ.ย.", "ก.ค.","ส.ค.","ก.ย.",
    "ต.ค.","พ.ย.","ธ.ค.");
    //thday[now.getDay()]
    this.date = ("วันที่ "+ now.getDate()+ " " + thmonth[now.getMonth()]+ " " + (0+now.getFullYear()+543));

    let hour = now.getHours();
    let min=now.getMinutes();
    let sec =now.getSeconds();

    if (hour>24) { hour=hour-24; }
    else { hour=hour; }

    this.time = "เวลา "+((hour<=9) ? "0"+hour : hour) + ":" + ((min<=9) ? "0"+min:min) + ":"+ ((sec<=9) ? "0"+ sec:sec);
  }

  getAutoComplete(val){
    let headers = new Headers({'Content-Type':'application/json'});
    let options = new ResponseOptions({headers:headers});
    let body = {enterprise_id:val};   
    this.http.post('https://twelfth-guard.site/service/getAutoComplete.php',body,options)
    .subscribe(data=>{
      if(data.json()[0]){
        this.autocomplete = data.json()[0].dbresult;
      }else{
        this.autocomplete = [];
      }
    },error=>{
      //console.log("error");
    })
  }

  getInout(val){
    let headers = new Headers({'Content-Type':'application/json'});
    let options = new ResponseOptions({headers:headers});
    let body = {enterprise_id:val};   
    this.http.post('https://twelfth-guard.site/service/getInout.php',body,options)
    .subscribe(data=>{
      //console.log(data.json()[0].dbresult);
      if(data){
        this.dataIn = data.json()[0].dbresult;
        this.rows = data.json()[0].dbresult;
        this.count = this.rows.length;
        //redirect page
        //this.router.navigateByUrl('/select', data.json()[1].dbresult[0].id);
        //this.router.navigate(['select'], data.json()[1].dbresult[0].id);
        
        //console.log("id"+data[1].dbresult[0].id);
      }else{
        this.dataIn = [];
        //console.log("not found");
        // ข้อความแจ้งเตือน
        //this.ErrorAlert();
      }
    },error=>{
      //console.log("error");
    })
  }

  getResident(val){
    let headers = new Headers({'Content-Type':'application/json'});
    let options = new ResponseOptions({headers:headers});
    let body = {enterprise_id:val};   
    this.http.post('https://twelfth-guard.site/service/getResident.php',body,options)
    .subscribe(data=>{
      if(data.json()[0]){
        this.resident = data.json()[0].dbresult;
        //console.log(data.json()[0].dbresult);
        //redirect page
        //this.router.navigateByUrl('/select', data.json()[1].dbresult[0].id);
        //this.router.navigate(['select'], data.json()[1].dbresult[0].id);
        
        //console.log("id"+data[1].dbresult[0].id);
      }else{
        this.resident = [];
        //console.log("not found");
        // ข้อความแจ้งเตือน
        //this.ErrorAlert();
      }
    },error=>{
      //console.log("error");
    })
  }

  initializeItems(){ 
      //this.items = ["มข789","ทร2222", "dravid"]; 
  }

  search(event){
    const val = event.target.value.toLowerCase();
    this.getAutoComplete(this.val);

    this.getResident(this.val);
    // filter our data
    const resident = this.resident.filter(function(d) {
      return d.licenseplate.toLowerCase().indexOf(val) !== -1 || !val;
    });

    this.getInout(this.val);
    // filter our data
    const inout = this.dataIn.filter(function(e) {
      return e.licenseplate.toLowerCase().indexOf(val) !== -1 || !val;
    });

    //console.log(resident);
    if(resident > []){
      this.chkRes(resident,val);
    }
    if(inout > []){
    this.chkIn(inout,val);
    }
    // update the rows
    //this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    //this.table.offset = 0;
    // Reset items back to all of the items
    this.initializeItems();
    this.array = [];
    for(let i=0;i<this.autocomplete.length;i++){
      this.array.push(this.autocomplete[i].licenseplate);
    }
    // if the value is an empty string don't filter the itemsง
    console.log(this.array);
    if (val && val.trim() != '') {
      this.isItemAvailable = true;
      this.items = this.array.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }else{
      this.isItemAvailable = false;
    }
    
  }
  checkFocus(event){
    const val = event.target.value.toLowerCase();
    this.getAutoComplete(this.val);
    this.initializeItems();
    this.array = [];
    for(let i=0;i<this.autocomplete.length;i++){
      this.array.push(this.autocomplete[i].licenseplate);
    }
    // if the value is an empty string don't filter the itemsง
    console.log(this.array);
    if (val && val.trim() != '') {
      this.isItemAvailable = true;
      this.items = this.array.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }else{
      this.isItemAvailable = false;
    }
  }

  /*checkBlur(){
    this.isItemAvailable = false;
  }*/
  show(){
    this.keyboard.show();
  }

  closeCursor(){
    this.isItemAvailable = false;
  }

  select(item){
    this.lecenseplate = item;
    this.isItemAvailable = false;
    this.getResident(this.val);
    // filter our data
    const resident = this.resident.filter(function(d) {
      return d.licenseplate.toLowerCase().indexOf(item) !== -1 || !item;
    });

    this.getInout(this.val);
    // filter our data
    const inout = this.dataIn.filter(function(e) {
      return e.licenseplate.toLowerCase().indexOf(item) !== -1 || !item;
    });

    if(resident > []){
      this.chkRes(resident,item);
    }
    if(inout > []){
    this.chkIn(inout,item);
    }
  }

  chkRes(resident,val){    
    
      if(resident[0].licenseplate == val){
        this.status = resident[0].status;
        this.data_room = resident[0].homenumber;
        this.variable = "true";
      }else{
        this.status = "ผู้มาติดต่อ";
        this.data_room = "";
        this.variable = null;
      }

  }

  chkIn(inout,val){
    console.log(inout[0].id);

    if(inout[0].licenseplate == val){
      this.inout = "out";
      this.data_room = inout[0].description;
      this.variable = "true";
      this.dataid = inout[0].id;
    }else{
      this.inout = "in";
      this.data_room = "";
      this.variable = null;
      this.dataid = "";
    }
  }

save_car(){
  this.clickSound.play();
    if(this.lecenseplate == null || this.description == null || this.inout == null){
      this.ErrorAlert();
    }else{
      if(this.inout == "in"){
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new ResponseOptions({headers:headers});
        let body = {lecense_plate:this.lecenseplate,description:this.description,inout:this.inout,enterprise_id:this.val,status:this.status,car_type:'รถยนต์'};   
        this.http.post('https://twelfth-guard.site/service/saveInout.php',body,options)
        .subscribe(data=>{
          if(data){
            this.SuccessAlert();
            this.lecenseplate = null;
            this.description = null;
            this.inout = "in";
            this.getInout(this.val);
          }else{
            // ข้อความแจ้งเตือน
            //this.ErrorAlert();
          }
        },error=>{
          //console.log("error");
        })
      }else{
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new ResponseOptions({headers:headers});
        let body = {id:this.dataid};   
        this.http.post('https://twelfth-guard.site/service/updateInout.php',body,options)
        .subscribe(data=>{
          if(data){
            this.SuccessAlert();
            this.lecenseplate = null;
            this.description = null;
            this.inout = "in";
            this.getInout(this.val);
          }else{
            // ข้อความแจ้งเตือน
            //this.ErrorAlert();
          }
        },error=>{
          //console.log("error");
        })        
      }
    }
  }
   
save_bike(){
  this.clickSound.play();
    if(this.lecenseplate == null || this.description == null || this.inout == null){
      this.ErrorAlert();
    }else{
      if(this.inout == "in"){
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new ResponseOptions({headers:headers});
        let body = {lecense_plate:this.lecenseplate,description:this.description,inout:this.inout,enterprise_id:this.val,status:this.status,car_type:'รถจักรยานยนต์'};   
        this.http.post('https://twelfth-guard.site/service/saveInout.php',body,options)
        .subscribe(data=>{
          if(data){
            this.SuccessAlert();
            this.lecenseplate = null;
            this.description = null;
            this.inout = "in";
            this.getInout(this.val);
          }else{
            // ข้อความแจ้งเตือน
            //this.ErrorAlert();
          }
        },error=>{
          //console.log("error");
        })
      }else{
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new ResponseOptions({headers:headers});
        let body = {id:this.dataid};   
        this.http.post('https://twelfth-guard.site/service/updateInout.php',body,options)
        .subscribe(data=>{
          if(data){
            this.SuccessAlert();
            this.lecenseplate = null;
            this.description = null;
            this.inout = "in";
            this.getInout(this.val);
          }else{
            // ข้อความแจ้งเตือน
            //this.ErrorAlert();
          }
        },error=>{
          //console.log("error");
        })        
      }
    }
  }

   
save_special(){
  this.clickSound.play();
    if(this.lecenseplate == null || this.description == null || this.inout == null){
      this.ErrorAlert();
    }else{
      if(this.inout == "in"){
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new ResponseOptions({headers:headers});
        let body = {lecense_plate:this.lecenseplate,description:this.description,inout:this.inout,enterprise_id:this.val,status:this.status,car_type:'รถบริการพิเศษ'};   
        this.http.post('https://twelfth-guard.site/service/saveInout.php',body,options)
        .subscribe(data=>{
          if(data){
            this.SuccessAlert();
            this.lecenseplate = null;
            this.description = null;
            this.inout = "in";
            this.getInout(this.val);
          }else{
            // ข้อความแจ้งเตือน
            //this.ErrorAlert();
          }
        },error=>{
          //console.log("error");
        })
      }else{
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new ResponseOptions({headers:headers});
        let body = {id:this.dataid};   
        this.http.post('https://twelfth-guard.site/service/updateInout.php',body,options)
        .subscribe(data=>{
          if(data){
            this.SuccessAlert();
            this.lecenseplate = null;
            this.description = null;
            this.inout = "in";
            this.getInout(this.val);
          }else{
            // ข้อความแจ้งเตือน
            //this.ErrorAlert();
          }
        },error=>{
          //console.log("error");
        })        
      }
    }
  }
  
  async ErrorAlert() {
    const alert = await this.alertController.create({
      message: 'กรุณาป้อนข้อมูลให้ครบ',
      cssClass: 'alert-danger',
      buttons: [
        {
          text: 'ตกลง'
        }]
    });

    await alert.present();
  }

  async SuccessAlert() {
    const alert = await this.alertController.create({
      message: 'บันทึกข้อมูลสำเร็จ',
      cssClass: 'alert-success',
      buttons: [
        {
          text: 'ตกลง'
        }]
    });

    await alert.present();
  }
}
