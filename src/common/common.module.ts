import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
import { HeaderComponent } from './components/header.component';
import { SelectComponent } from './components/select.component';
import {CounterComponent} from './components/test.form.component'

@NgModule({
  declarations: [
    HeaderComponent,
    SelectComponent,
    CounterComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    CommonModule,
    IonicModule,
    HeaderComponent,
    SelectComponent,
    CounterComponent
  ]
})
export class BoalCommonModule {}
