import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  gender:any;

  constructor(private storage: Storage) {
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

  ngOnInit() {
  }

}
