import { Component, OnInit, ViewChild } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Http,ResponseOptions,Headers } from '@angular/http';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {

  title = 'angular-datatables';
  rows = [];
  temp = [];
  
  @ViewChild(DatatableComponent, { static: false }) table: DatatableComponent;

  inout_all = [];
  constructor(private storage: Storage, public alertController: AlertController,private http: Http) {
    this.storage.get('key').then((val) => {
      console.log('Your key is', val);
        this.getInout_all(val);
    });
  }

  ngOnInit() {
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
