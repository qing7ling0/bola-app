import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SampleListPage } from './sample-list/sample-list';
import { BoalCommonModule } from '../../common/common.module'
import { OrderCustomerEditComponent } from '../order-create/customer-edit/customer-edit.component'

@NgModule({
  declarations: [
    SampleListPage
  ],
  imports: [
    IonicPageModule, BoalCommonModule,
  ],
  exports: [
    IonicPageModule, BoalCommonModule
  ],
  entryComponents:[SampleListPage, OrderCustomerEditComponent]
})
export class AllotModule {}
