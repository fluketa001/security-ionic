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

  public enableSound = true;
  private clickSound = new Audio("data:audio/mpeg;base64,//sQxAAAA+i5OrQRABC9mG+3BCAACCAH/f//yE5z0Od/yf//ITnO853/O9CEIygAgEPg+8AAUWCwVioVCAEBgAAD/65xat0KnkqrfOEKkxfjOI6H//Ofpf/q8jZTBgc8uM4jcsMMMMH/+xLEAgAE6M1XGCKAAAAANIOAAAQIAADL6BfAW9DeJCI78xlb/EWEVL/6REV//0Uw0SMb//AY4ypMQU1FMy45OS4zqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo="
  );
  public soundEnabled = true;

  constructor(public menuCtrl: MenuController, private storage: Storage, private router: Router,private http: Http) {
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
      this.http.post('https://twelfth-guard.site/service/getEnterprise.php',body,options)
      .subscribe(data=>{
        this.items = data.json()[0].dbresult;
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

  select(key,name){
    // set a key/value.
    this.storage.set('key', key);
    this.storage.set('name_enterprise', name);
    //this.router.navigateByUrl('/home');
    /*this.router.navigate(['/home'])
    .then(() => {
      window.location.reload();
    });*/
  }
  ngOnInit() {
  }

}
