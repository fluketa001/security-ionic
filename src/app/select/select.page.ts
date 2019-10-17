import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Http,ResponseOptions,Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select',
  templateUrl: './select.page.html',
  styleUrls: ['./select.page.scss'],
})
export class SelectPage implements OnInit {

  public items: Array<any>;
  id:any;
  constructor(public menuCtrl: MenuController, private storage: Storage, private router: Router,private http: Http) {
    this.ionViewWillEnter(); 
      /*setInterval(function(){ 
        this.ionViewWillEnter(); 
      }, 5000);*/
  }
 
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
    // get a key/value pair
    this.storage.get('id').then((val) => {
      console.log('Your id is', val);
      this.id = val;
      let headers = new Headers({'Content-Type':'application/json'});
      let options = new ResponseOptions({headers:headers});
      let body = {id:this.id};   
      this.http.post('https://edmkk.com/service/getEnterprise.php',body,options)
      .subscribe(data=>{
        this.items = [data.json()[0].dbresult[0]];
        console.log(this.items[0]);
      },error=>{
        console.log("error");
      })
    });
    this.storage.get('key').then((val) => {
      console.log('Your key is', val);
    });
  }
   
  sqlload(){
  }

  select(key){
    // set a key/value
    this.storage.set('key', key);
    //this.router.navigateByUrl('/home');
  }

  ngOnInit() {
  }

}
