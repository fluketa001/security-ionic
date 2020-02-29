import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReportModalPage } from './report-modal.page';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';

const routes: Routes = [
  {
    path: '',
    component: ReportModalPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ionic4DatepickerModule,
    RouterModule.forChild(routes)
  ],
  //exporting to be used in another component
  exports: [
    ReportModalPage //<----- this is if it is going to be used else where
  ],
  declarations: [ReportModalPage],  //<---- Needs to be declared
  entryComponents: [ReportModalPage] //<----This means that the Modal will be imperatively(v3 it was IonicPage()
})
export class ReportModalPageModule {}
