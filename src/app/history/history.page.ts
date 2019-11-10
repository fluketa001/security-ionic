import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Http,ResponseOptions,Headers } from '@angular/http';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';
import { ModalController } from '@ionic/angular';

import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';
@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  title = 'angular-datatables';
  rows = [];
  temp = [];
  date:any;
  smart:any;
  select:any = "smart";
  //changedate:any;
  val:any;

  date_now:any;
  time:any;

  
  datePickerObj: any = {};
  selectedDate;
  
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  inout_all = [];
  constructor(public modalCtrl: ModalController,private storage: Storage, public alertController: AlertController,private http: Http) {
    this.smart = null;
    this.date = "true";
    this.storage.get('key').then((val) => {
      console.log('Your key is', val);
        this.val = val;
        this.getInout_all(val);
    });
    setInterval(() => {
      this.getTime();
    }, 1000);
  }

  ngOnInit() {
    this.datePickerObj = {
      setLabel: 'เลือก',  // default 'Set'
      todayLabel: 'วันนี้', // default 'Today'
      closeLabel: 'ปิด',
      monthsList: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"],
      weeksList: ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"],
      dateFormat: 'DD-MM-YYYY',
      inputDate: new Date()
    };
  }
  
  async openDatePicker() {
    const datePickerModal = await this.modalCtrl.create({
      component: Ionic4DatepickerModule,
      cssClass: 'li-ionic4-datePicker',
      componentProps: { 
         'objConfig': this.datePickerObj, 
         'selectedDate': this.selectedDate 
      }
    });
    await datePickerModal.present();
 
    datePickerModal.onDidDismiss()
      .then((data) => {
        console.log(data);
        this.selectedDate = data.data.date;
      });
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
    this.date_now = ("วันที่ "+ now.getDate()+ " " + thmonth[now.getMonth()]+ " " + (0+now.getFullYear()+543));

    let hour = now.getHours();
    let min=now.getMinutes();
    let sec =now.getSeconds();

    if (hour>24) { hour=hour-24; }
    else { hour=hour; }

    this.time = "เวลา "+((hour<=9) ? "0"+hour : hour) + ":" + ((min<=9) ? "0"+min:min) + ":"+ ((sec<=9) ? "0"+ sec:sec);
  }

  onChange(){
    if(this.select == "smart"){
      this.smart = null;
      this.date = "true";
      this.getInout_all(this.val);
      console.log(this.smart);
    }else{
      this.smart = "true";
      this.date = null;
      this.selectedDate = null;
      this.rows = [];
      console.log(this.date);
    }
  }

  onChangeDate(selectedDate){
    const val = moment(selectedDate).format('MM-DD-YY');
    console.log(val);

    // filter our data
    const inout_all = this.inout_all.filter(function(d) {
      return d.carin.toLowerCase().indexOf(val) !== -1 || !val || d.carout.toLowerCase().indexOf(val) !== -1 || d.description.toLowerCase().indexOf(val) !== -1 || d.licenseplate.toLowerCase().indexOf(val) !== -1;
    });
    console.log(this.inout_all);

    // update the rows
    this.rows = inout_all;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

  getInout_all(val){
    let headers = new Headers({'Content-Type':'application/json'});
    let options = new ResponseOptions({headers:headers});
    let body = {enterprise_id:val};   
    this.http.post('https://edmkk.com/service/getInout_all.php',body,options)
    .subscribe(data=>{
      if(data.json()[0]){
        this.inout_all = data.json()[0].dbresult;
        this.rows = data.json()[0].dbresult;
        console.log(data.json()[0].dbresult);
        //redirect page
        //this.router.navigateByUrl('/select', data.json()[1].dbresult[0].id);
        //this.router.navigate(['select'], data.json()[1].dbresult[0].id);
        
        //console.log("id"+data[1].dbresult[0].id);
      }else{
        this.inout_all = [];
        console.log("not found");
        // ข้อความแจ้งเตือน
        //this.ErrorAlert();
      }
    },error=>{
      console.log("error");
    })
  }

  filterDatatable(event){
    console.log(event);
    const val = event.target.value.toLowerCase();

    // filter our data
    const inout_all = this.inout_all.filter(function(d) {
      return d.carin.toLowerCase().indexOf(val) !== -1 || !val || d.carout.toLowerCase().indexOf(val) !== -1 || d.description.toLowerCase().indexOf(val) !== -1 || d.licenseplate.toLowerCase().indexOf(val) !== -1;
    });

    // update the rows
    this.rows = inout_all;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
}
