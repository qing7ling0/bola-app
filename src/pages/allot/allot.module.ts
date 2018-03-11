import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllotPage } from './allot';
import { SampleListPage } from './sample-list/sample-list';
import { ApplyListPage } from './apply-list/apply-list';
import { AllotListPage } from './allot-list/allot-list';
import { OutboundComponent } from './allot.component/outbound';
import { BoalCommonModule } from '../../common/common.module'
import { OrderCustomerEditComponent } from '../order-create/customer-edit/customer-edit.component'

@NgModule({
  declarations: [
    AllotPage,
    SampleListPage,
    ApplyListPage,
    AllotListPage,
    OutboundComponent
  ],
  imports: [
    IonicPageModule, BoalCommonModule,
  ],
  exports: [
    IonicPageModule, BoalCommonModule
  ],
  entryComponents:[AllotPage, ApplyListPage, AllotListPage, SampleListPage, OrderCustomerEditComponent, OutboundComponent]
})
export class AllotModule {}
