import { Component, OnInit , ViewChild} from '@angular/core';
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

  resident = [];

  constructor(private storage: Storage, public alertController: AlertController,private http: Http, private callNumber: CallNumber) {
    this.storage.get('key').then((val) => {
      console.log('Your key is', val);
        this.getResident(val);
    });
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

  getResident(val){
    let headers = new Headers({'Content-Type':'application/json'});
    let options = new ResponseOptions({headers:headers});
    let body = {enterprise_id:val};   
    this.http.post('https://edmkk.com/service/getResident.php',body,options)
    .subscribe(data=>{
      if(data.json()[0]){
        this.resident = data.json()[0].dbresult;
        this.rows = data.json()[0].dbresult;
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
    const resident = this.resident.filter(function(d) {
      return d.name.toLowerCase().indexOf(val) !== -1 || !val || d.homenumber.toLowerCase().indexOf(val) !== -1 || d.telephone.toLowerCase().indexOf(val) !== -1 || d.licenseplate.toLowerCase().indexOf(val) !== -1;
    });

    // update the rows
    this.rows = resident;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }
}
