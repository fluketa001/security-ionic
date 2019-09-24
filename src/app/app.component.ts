import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

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
  public setting = [
    {
      title: 'เปลี่ยนโครงการ',
      url: '/select',
      icon: 'md-albums'
    }
  ];
  public exit = [
    {
      title: 'ออกจากระบบ',
      url: '/login',
      icon: 'md-log-out'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
