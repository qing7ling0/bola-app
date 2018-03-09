import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AllotPage } from './allot';
import { SampleListPage } from './sample-list/sample-list';
import { ApplyListPage } from './apply-list/apply-list';
import { BoalCommonModule } from '../../common/common.module'
import { OrderCustomerEditComponent } from '../order-create/customer-edit/customer-edit.component'

@NgModule({
  declarations: [
    AllotPage,
    SampleListPage,
    ApplyListPage
  ],
  imports: [
    IonicPageModule, BoalCommonModule,
  ],
  exports: [
    IonicPageModule, BoalCommonModule
  ],
  entryComponents:[AllotPage, ApplyListPage, SampleListPage, OrderCustomerEditComponent]
})
export class AllotModule {}
