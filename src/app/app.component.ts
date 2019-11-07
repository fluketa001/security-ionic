import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
declare var nativeclick;
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
  name_enterprise:any;
  status:any;
  gender:any;
  picture:any;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private storage: Storage
  ) {
    this.initializeApp();
    this.storage.get('name_enterprise').then((val) => {
      this.name_enterprise = val;
      console.log('Your name_enterprise is', val);
    });
    this.storage.get('name').then((val) => {
      this.name = val;
      console.log('Your key is', val);
    });
    this.storage.get('status').then((val) => {
      console.log('Your status is', val);
      if(val == "admin"){
        this.status = "ผู้ดูแลระบบ";
      }else if(val == "secretary"){
        this.status = "เลขา";
      }else if(val == "security"){
        this.status = "เจ้าหน้าที่รักษาความปลอดภัย";
      }
    });
    this.storage.get('gender').then((val) => {
      this.gender = val;
      console.log('Your gender is', val);
    });
    this.storage.get('picture').then((val) => {
      this.picture = val;
    });
  }

  initializeApp() {
    this.platform.ready().then((val) => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      if (val === 'cordova'){
        var clickyClasses = ['button', 'a']; // add other classes that should make a sound when clicked on
        nativeclick.watch(clickyClasses);
      }
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
    this.storage.remove('name_enterprise');
  }
  
  public enableSound = true;
  private clickSound = new Audio("data:audio/mpeg;base64,//sQxAAAA+i5OrQRABC9mG+3BCAACCAH/f//yE5z0Od/yf//ITnO853/O9CEIygAgEPg+8AAUWCwVioVCAEBgAAD/65xat0KnkqrfOEKkxfjOI6H//Ofpf/q8jZTBgc8uM4jcsMMMMH/+xLEAgAE6M1XGCKAAAAANIOAAAQIAADL6BfAW9DeJCI78xlb/EWEVL/6REV//0Uw0SMb//AY4ypMQU1FMy45OS4zqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo="
  );

  public status_sound: string = "";

  public soundEnabled = true;


  private clickyClasses = [
      "button", // buttons
  ];

  private buttonClickFn = (event) => {

    //this.status_sound += `(${event.type})\t${event.target.classList}\n`;
    let cl = event.target.classList;
    let elType = event.target.tagName.toLowerCase();
    this.status_sound += `(${event.type})\t[${elType}]\t${cl}\n`;

    if (event.type === 'ionChange'){
      if (elType !== 'ion-toggle' && elType !== 'ion-select' && elType !== 'ion-range')
        return;
    }

    if ( cl.contains("button")
      || cl.contains("in-list")
      || cl.contains("in-item")
      || cl.contains("activated")
      || cl.contains("searchbar-input")
      || cl.contains("sc-ion-back-button-md")
      || cl.contains("sc-ion-back-button-ios")
      || cl.contains("alert-button-inner")
      || cl.contains("sc-ion-alert-md")
      || cl.contains("sc-ion-alert-ios")
    ) {
      this.fnClick();
    }
  };


  fnClick() {
    if (this.clickSound && this.soundEnabled)
      this.clickSound.play();
  }

  ngOnInit() {

    window.addEventListener("click", this.buttonClickFn, false);
    window.addEventListener("ionChange", this.buttonClickFn, false);

  }
}
