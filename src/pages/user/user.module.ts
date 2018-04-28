import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerProfilePage } from './self/self';
import { BoalCommonModule } from '../../common/common.module'
import { OrderCustomerEditComponent } from '../order-create/customer-edit/customer-edit.component'

@NgModule({
  declarations: [
    CustomerProfilePage,
  ],
  imports: [
    IonicPageModule, BoalCommonModule,
  ],
  exports: [
    IonicPageModule, BoalCommonModule
  ],
  entryComponents:[CustomerProfilePage, OrderCustomerEditComponent]
})
export class CustomerModule {}
