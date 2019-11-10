import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DatePickerModule } from 'ionic4-date-picker';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';

import { IonicModule } from '@ionic/angular';

import { HistoryPage } from './history.page';

const routes: Routes = [
  {
    path: '',
    component: HistoryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    DatePickerModule,
    IonicModule,
    Ionic4DatepickerModule,
    NgxDatatableModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HistoryPage]
})
export class HistoryPageModule {}
