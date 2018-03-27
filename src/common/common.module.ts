import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
import { HeaderComponent } from './components/header.component';
import { SelectComponent } from './components/select.component';
import { InputSelectComponent } from './components/input-select.component';
import { FormTextComponent } from './components/form-text.component';
import { FormInputComponent } from './components/form-input.component';

@NgModule({
  declarations: [
    HeaderComponent,
    SelectComponent,
    InputSelectComponent,
    FormTextComponent,
    FormInputComponent,
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
    InputSelectComponent,
    FormTextComponent,
    FormInputComponent,
  ]
})
export class BoalCommonModule {}
