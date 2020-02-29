import { Component, OnInit , ViewChild, Input} from '@angular/core';
import { NavParams } from '@ionic/angular';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Http,ResponseOptions,Headers } from '@angular/http';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number/ngx';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  title = 'angular-datatables';
  rows = [];
  temp = [];
  
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  residents = [];
  date:any;
  time:any;

  constructor(private storage: Storage, public alertController: AlertController,private http: Http, private callNumber: CallNumber) {
    this.storage.get('key').then((val) => {
      console.log('Your key is', val);
        this.getResidents(val);
    });
    setInterval(() => {
      this.getTime();
    }, 1000);
   }

  tel(number){
    console.log(number);
    this.callNumber.callNumber(number, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
   }
 
  ngOnInit() {
    /*this.fetch((data) => {
      this.temp = data;
      this.rows = data;
      console.log(this.rows);
    });*/
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

  getResidents(val){
    let headers = new Headers({'Content-Type':'application/json'});
    let options = new ResponseOptions({headers:headers});
    let body = {enterprise_id:val};   
    this.http.post('https://twelfth-guard.site/service/getResidents.php',body,options)
    .subscribe(data=>{
      if(data.json()[0]){
        this.residents = data.json()[0].dbresult;
        this.rows = data.json()[0].dbresult;
        console.log(data.json()[0].dbresult);
        //redirect page
        //this.router.navigateByUrl('/select', data.json()[1].dbresult[0].id);
        //this.router.navigate(['select'], data.json()[1].dbresult[0].id);
        
        //console.log("id"+data[1].dbresult[0].id);
      }else{
        this.residents = [];
        console.log("not found");
        // ข้อความแจ้งเตือน
        //this.ErrorAlert();
      }
    },error=>{
      console.log("error");
    })
  }
 
  /*fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', 'assets/data/company.json');
 
    req.onload = () => {
      const data = JSON.parse(req.response);
      cb(data);
    };
 
    req.send();
  }*/
  filterDatatable(event){
    console.log(event);
    const val = event.target.value.toLowerCase();

    // filter our data
    const residents = this.residents.filter(function(d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val || d.homenumber.toLowerCase().indexOf(val) !== -1 || d.telephone.toLowerCase().indexOf(val) !== -1 || d.licenseplate.toLowerCase().indexOf(val) !== -1;
    });

    // update the rows
    this.rows = residents;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
}
