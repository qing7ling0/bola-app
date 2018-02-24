import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderTrackPage } from './order-track';
import { BoalCommonModule } from '../../common/common.module'
import { OrderTrackComponent } from './track.component/track.component'

@NgModule({
  declarations: [
    OrderTrackPage,
    OrderTrackComponent
  ],
  imports: [
    IonicPageModule, BoalCommonModule
  ],
  exports: [
    IonicPageModule, BoalCommonModule
  ],
  entryComponents:[OrderTrackPage]
})
export class OrderTrackModule {}
