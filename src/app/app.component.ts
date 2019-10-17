import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'บันทึกเข้าออก',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'ค้นหาข้อมูล',
      url: '/search',
      icon: 'search'
    },
    {
      title: 'ประวัติการจอดรถ',
      url: '/history',
      icon: 'md-bookmarks'
    }
  ];

  name:any;
  status:any;
  gender:any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private storage: Storage
  ) {
    this.initializeApp();
    this.storage.get('name').then((val) => {
      this.name = val;
      console.log('Your key is', val);
    });
    this.storage.get('status').then((val) => {
      console.log('Your status is', val);
      if(val == "1"){
        this.status = "ผู้ดูแลระบบ";
      }else if(val == "2"){
        this.status = "เลขา";
      }else if(val == "3"){
        this.status = "เจ้าหน้าที่รักษาความปลอดภัย";
      }
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
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout(){
      this.storage.clear();

      //redirect page
      this.router.navigate(['login']);
  }


  change(){
    //redirect page
    this.router.navigate(['select']);
    this.storage.remove('key');
  }
}
