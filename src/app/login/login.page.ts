import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Http,ResponseOptions,Headers } from '@angular/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  username:any;
  pass:any;

  constructor(public menuCtrl: MenuController,private http: Http,private router: Router, private storage: Storage, public alertController: AlertController) { }
  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  /*this.films = this.httpClient.get('https://swapi.co/api/films');
    this.films
    .subscribe(data => {
      console.log('my data: ', data);
    })*/

  ngOnInit() {
  }
  
  login(){
    let headers = new Headers({'Content-Type':'application/json'});
    let options = new ResponseOptions({headers:headers});
    let body = {username:this.username,pass:this.pass};   
    this.http.post('https://edmkk.com/service/getLogin.php',body,options)
    .subscribe(data=>{
      console.log(data.json()[0].apistatus);
      if(data.json()[0].apistatus=="1"){
        //ไปหน้า push
        console.log(data.json()[1].dbresult[0].id);-
        console.log(data.json()[1].dbresult[0].name);
        console.log(data.json()[1].dbresult[0].username);
        console.log(data.json()[1].dbresult[0].status);
        
        // set a key/value
        this.storage.set('id', data.json()[1].dbresult[0].id);
        this.storage.set('name', data.json()[1].dbresult[0].name);
        this.storage.set('status', data.json()[1].dbresult[0].status);
        this.storage.set('gender', data.json()[1].dbresult[0].gender);
        this.storage.set('picture', data.json()[1].dbresult[0].picture);

        //redirect page
        this.router.navigate(['select'], data.json()[1].dbresult[0].id);
        //this.router.navigate(['select'], data.json()[1].dbresult[0].id);
        
        //console.log("id"+data[1].dbresult[0].id);
      }else{
        // ข้อความแจ้งเตือน
        this.ErrorAlert();
      }
    },error=>{
      console.log("error");
    })
  }
  async ErrorAlert() {
    const alert = await this.alertController.create({
      header: 'ข้อผิดพลาด!',
      message: 'username หรือ password ไม่ถูกต้อง',
      buttons: ['OK']
    });

    await alert.present();
  }
}
