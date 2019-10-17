import { Component, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Http,ResponseOptions,Headers } from '@angular/http';
import { AlertController } from '@ionic/angular';
import { empty } from 'rxjs';

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

  lecenseplate:any;
  description:any;
  inout:any = "in";

  val:any;
  dataid:any;

  status:any = "ผู้มาติดต่อ";
  data_room:any = "";
  variable:any;
  
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  constructor(private storage: Storage, private router: Router, public alertController: AlertController,private http: Http) {
    this.storage.get('key').then((val) => {
      console.log('Your key is', val);
      this.getInout(val);
      this.val = val;
        this.getResident(val);
    });
  }

  getInout(val){
    let headers = new Headers({'Content-Type':'application/json'});
    let options = new ResponseOptions({headers:headers});
    let body = {enterprise_id:val};   
    this.http.post('https://edmkk.com/service/getInout.php',body,options)
    .subscribe(data=>{
      console.log(data.json()[0].dbresult);
      if(data){
        this.dataIn = data.json()[0].dbresult;
        this.rows = data.json()[0].dbresult;
        //redirect page
        //this.router.navigateByUrl('/select', data.json()[1].dbresult[0].id);
        //this.router.navigate(['select'], data.json()[1].dbresult[0].id);
        
        //console.log("id"+data[1].dbresult[0].id);
      }else{
        this.dataIn = [];
        console.log("not found");
        // ข้อความแจ้งเตือน
        //this.ErrorAlert();
      }
    },error=>{
      console.log("error");
    })
  }

  getResident(val){
    let headers = new Headers({'Content-Type':'application/json'});
    let options = new ResponseOptions({headers:headers});
    let body = {enterprise_id:val};   
    this.http.post('https://edmkk.com/service/getResident.php',body,options)
    .subscribe(data=>{
      if(data.json()[0]){
        this.resident = data.json()[0].dbresult;
        console.log(data.json()[0].dbresult);
        //redirect page
        //this.router.navigateByUrl('/select', data.json()[1].dbresult[0].id);
        //this.router.navigate(['select'], data.json()[1].dbresult[0].id);
        
        //console.log("id"+data[1].dbresult[0].id);
      }else{
        this.resident = [];
        console.log("not found");
        // ข้อความแจ้งเตือน
        //this.ErrorAlert();
      }
    },error=>{
      console.log("error");
    })
  }

  search(event){
    const val = event.target.value.toLowerCase();
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

    console.log(resident);
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

    if(inout[0].licenseplate == val){
      this.inout = "out";
      this.data_room = inout[0].description;
      this.variable = "true";
      this.dataid = this.dataIn[0].id;
      console.log(this.dataIn[0].id);
    }else{
      this.inout = "in";
      this.data_room = "";
      this.variable = null;
      this.dataid = "";
    }
  }

  
  save(){
    console.log(this.lecenseplate);
    console.log(this.description);
    console.log(this.inout);
    if(this.lecenseplate == null || this.description == null || this.inout == null){
      this.ErrorAlert();
    }else{
      if(this.inout == "in"){
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new ResponseOptions({headers:headers});
        let body = {lecense_plate:this.lecenseplate,description:this.description,inout:this.inout,enterprise_id:this.val};   
        this.http.post('https://edmkk.com/service/saveInout.php',body,options)
        .subscribe(data=>{
          console.log(data);
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
          console.log("error");
        })
      }else{
        let headers = new Headers({'Content-Type':'application/json'});
        let options = new ResponseOptions({headers:headers});
        let body = {id:this.dataid};   
        this.http.post('https://edmkk.com/service/updateInout.php',body,options)
        .subscribe(data=>{
          console.log(data);
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
          console.log("error");
        })        
      }
    }
  }
  
  async ErrorAlert() {
    const alert = await this.alertController.create({
      header: 'ข้อผิดพลาด!',
      message: 'กรุณาป้อนข้อมูลให้ครบ',
      buttons: ['OK']
    });

    await alert.present();
  }

  async SuccessAlert() {
    const alert = await this.alertController.create({
      header: 'สำเร็จ',
      message: 'บันทึกข้อมูลสำเร็จ',
      buttons: ['OK']
    });

    await alert.present();
  }
}
