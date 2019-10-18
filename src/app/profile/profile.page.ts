import { Component, OnInit } from '@angular/core';
import { Http,ResponseOptions,Headers } from '@angular/http';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {

  id:any;
  name:any;
  telephone:any;
  address:any;
  gender:any;
  picture:any = "";

  constructor(private storage: Storage,private router: Router, public alertController: AlertController,private http: Http) {
    this.storage.get('id').then((val) => {
      this.id = val;
      console.log('Your key is', val);
    });
    this.storage.get('name').then((val) => {
      this.name = val;
      console.log('Your key is', val);
    });
    this.storage.get('telephone').then((val) => {
      this.telephone = val;
      console.log('Your key is', val);
    });
    this.storage.get('address').then((val) => {
      this.address = val;
      console.log('Your key is', val);
    });
    this.storage.get('gender').then((val) => {
      this.gender = val;
      console.log('Your gender is', val);
    });
    this.storage.get('picture').then((val) => {
      if(val == ""){
        if(this.gender == "male"){
          this.gender = "/assets/img/male-avatar.png";
        }else if(this.gender == "female"){
          this.gender = "/assets/img/female-avatar.png";
        }
      }else{
        this.picture = "";
      }
    });
   }

  edit() {
    if(this.name == null || this.telephone == null || this.address == null){
      this.ErrorAlert();
    }else{
      let headers = new Headers({'Content-Type':'application/json'});
      let options = new ResponseOptions({headers:headers});
      let body = {id:this.id,name:this.name,telephone:this.telephone,address:this.address,picture:this.picture};   
      this.http.post('https://edmkk.com/service/editProfile.php',body,options)
      .subscribe(data=>{
        console.log(data);
        if(data.json()[0].apistatus=="1"){
          this.SuccessAlert();
          this.storage.remove('name');
          this.storage.remove('telephone');
          this.storage.remove('address');
          this.storage.remove('picture');
          this.getUser();
        }else{
          // ข้อความแจ้งเตือน
          this.ErrorAlert();
        }
      },error=>{
        console.log("error");
      })
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
      buttons: [{
        text: 'OK',
        role: 'OK',
        handler: () => {
          window.location.reload();
        }
      }]
    });

    await alert.present();
  }

  getUser(){
    let headers = new Headers({'Content-Type':'application/json'});
    let options = new ResponseOptions({headers:headers});
    let body = {id:this.id};   
    this.http.post('https://edmkk.com/service/getUser.php',body,options)
    .subscribe(data=>{
      if(data.json()[0].apistatus=="1"){
        // set a key/value
        this.storage.set('name', data.json()[1].dbresult[0].name);
        this.storage.set('telephone', data.json()[1].dbresult[0].telephone);
        this.storage.set('address', data.json()[1].dbresult[0].address);
        this.storage.set('picture', data.json()[1].dbresult[0].picture);
        //redirect page
        //this.router.navigate(['select'], data.json()[1].dbresult[0].id);
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

}
