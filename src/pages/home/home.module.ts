import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule
  ],
  exports: [
    IonicPageModule
  ],
  entryComponents:[HomePage]
})
export class HomePageModule {}
