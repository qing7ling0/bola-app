import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderTrackPage } from './order-track';
import { BoalCommonModule } from '../../common/common.module'
import { OrderTrackComponent } from './track.component/track.component'
import { OrderFeedbackComponent } from './feedback.component/feedback.component'

@NgModule({
  declarations: [
    OrderTrackPage,
    OrderTrackComponent,
    OrderFeedbackComponent
  ],
  imports: [
    IonicPageModule, BoalCommonModule
  ],
  exports: [
    IonicPageModule, BoalCommonModule
  ],
  entryComponents:[OrderTrackPage, OrderFeedbackComponent]
})
export class OrderTrackModule {}
