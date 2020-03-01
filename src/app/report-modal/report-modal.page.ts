import { Component, OnInit } from '@angular/core';
import { AlertController,ModalController } from '@ionic/angular';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { Http,ResponseOptions,Headers } from '@angular/http';
import * as moment from 'moment';

@Component({
  selector: 'app-report-modal',
  templateUrl: './report-modal.page.html',
  styleUrls: ['./report-modal.page.scss'],
})
export class ReportModalPage implements OnInit {

  datePickerObj: any = {};

  selectedDate;
  selectedTime;

  TimeChk;

  selectedEndDate = ("0" + new Date().getDate()).slice(-2) +'-'+("0" + (new Date().getMonth() + 1)).slice(-2) +'-'+(new Date().getFullYear());
  selectedEndTime = moment(new Date().toISOString()).format("HH:mm");

  Date;
  EndDate;

  title:any;
  message:any;

  constructor(private socialSharing: SocialSharing,public modalController: ModalController, public alertController: AlertController,private http: Http) { }

  ngOnInit() {
    this.TimeChk = new Date().toISOString();
    console.log(new Date().toISOString());
    console.log(this.selectedEndDate);
    if(moment(this.TimeChk).format("HH:mm") >= "18:00" || moment(this.TimeChk).format("HH:mm") < "06:00"){
        this.selectedTime = "18:00";
      if(moment(this.TimeChk).format("HH:mm") >= "00:00" && moment(this.TimeChk).format("HH:mm") < "06:00"){
        if(new Date().getDate() == 1){
          var date = new Date();
          var startdate = new Date(date.setDate(date.getDate() - 1));
          console.log(startdate.getDate());
          var sdate = startdate.getDate();
          this.selectedDate = ("0" + sdate).slice(-2) +'-'+("0" + (new Date().getMonth() + 1)).slice(-2) +'-'+(new Date().getFullYear());
          //this.selectedDate = (new Date().getDate()) +'-'+(new Date().getMonth()+1) +'-'+(new Date().getFullYear());
        }else{
          var sdate = (new Date().getDate()-1);
          this.selectedDate = ("0" + sdate).slice(-2) +'-'+("0" + (new Date().getMonth() + 1)).slice(-2) +'-'+(new Date().getFullYear());
        }
        console.log("เย็น");
      }else{
        console.log("ค่ำ");
        var sdate = (new Date().getDate());
        this.selectedDate = ("0" + sdate).slice(-2) +'-'+("0" + (new Date().getMonth() + 1)).slice(-2) +'-'+(new Date().getFullYear());
      }
    }else{
      this.selectedTime = "06:00";
      this.selectedDate = (new Date().getDate()) +'-'+("0" + (new Date().getMonth() + 1)).slice(-2) +'-'+(new Date().getFullYear());
      console.log("เข้า");
    }
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

  time(selectedTime){
    this.selectedTime = selectedTime;
    console.log(this.selectedTime);
  }

  timeEnd(selectedEndTime){
    this.selectedEndTime = selectedEndTime;
    console.log(this.selectedEndTime);
  }

  share(){
    if(this.selectedDate == null || this.selectedTime == null){
      this.ErrorAlert();
    }else{

    let headers = new Headers({'Content-Type':'application/json'});
      let options = new ResponseOptions({headers:headers});
      let body = {selectedDate:this.Date,selectedTime:this.selectedTime,selectedEndDate:this.EndDate,selectedEndTime:this.selectedEndTime};   
      this.http.post('https://twelfth-guard.site/service/report.php',body,options)
      .subscribe(data=>{
        if(data.json().dbresult[0].url){
          console.log(data.json().dbresult[0].url);

          var onSuccess = function(result) {
            console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
            console.log("Shared to app: " + result.app); // On Android result.app since plugin version 5.4.0 this is no longer empty. On iOS it's empty when sharing is cancelled (result.completed=false)
          };
          
          var onError = function(msg) {
            console.log("Sharing failed with message: " + msg);
          };
          
          this.message = this.selectedDate+' '+this.selectedTime+' ถึง '+this.selectedEndDate+' '+this.selectedEndTime;
          let file = "https://twelfth-guard.site/service/"+data.json().dbresult[0].url;
          this.socialSharing.share(this.message,null,file,null).then(() => {
            onSuccess;
            // Sharing is possible
          }).catch(() => {
            onError;
            // Sharing is not possible
          });
        }else{
          console.log("not found");
          // ข้อความแจ้งเตือน
          //this.ErrorAlert();
        }
      },error=>{
        console.log("error");
      })
    }
  }

  async ErrorAlert() {
    const alert = await this.alertController.create({
      message: 'กรุณาเลือกวันที่และเวลาให้ครบ',
      cssClass: 'alert-danger',
      buttons: [
        {
          text: 'ตกลง'
        }]
    });

    await alert.present();
  }

  check(){
    let date = this.selectedDate.substring(0,2);
    let month = this.selectedDate.substring(5,3);
    let year = this.selectedDate.substring(10,6);
    console.log(date);
    console.log(month);
    console.log(year);
    this.Date = year+'-'+month+'-'+date
    console.log(this.selectedDate);
    //this.Date = moment(this.selectedDate).format("Y-DD-MM");
    console.log(this.Date);
  }

  check2(){
    let date = this.selectedEndDate.substring(0,2);
    let month = this.selectedEndDate.substring(5,3);
    let year = this.selectedEndDate.substring(10,6);
    console.log(date);
    console.log(month);
    console.log(year);
    //console.log(moment(this.EndDate).format("Y-MM-DD"));
    //this.EndDate = moment(this.selectedEndDate).format("Y-MM-DD");
    this.EndDate = year+'-'+month+'-'+date
    console.log(this.EndDate);

  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      'dismissed': true
    });
  }
  
  async openDatePicker() {
    const datePickerModal = await this.modalController.create({
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

  async DateEndPicker() {
    const datePickerModal = await this.modalController.create({
      component: Ionic4DatepickerModule,
      cssClass: 'li-ionic4-datePicker',
      componentProps: { 
         'objConfig': this.datePickerObj, 
         'selectedEndDate': this.selectedEndDate 
      }
    });
    await datePickerModal.present();
 
    datePickerModal.onDidDismiss()
      .then((data) => {
        console.log(data);
        this.selectedEndDate = data.data.date;
      });
  }

}
