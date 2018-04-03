import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { BoalCommonModule } from '../../common/common.module'

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule,BoalCommonModule
  ],
  exports: [
    IonicPageModule,BoalCommonModule
  ],
  entryComponents:[HomePage]
})
export class HomePageModule {}
