import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerReportPage } from './customer-report/customer-report';
import { CustomerShopReportPage } from './customer-shop-report/customer-shop-report';
import { CustomerProfilePage } from './customer-profile/customer-profile';
import { BoalCommonModule } from '../../common/common.module'
import { OrderCustomerEditComponent } from '../order-create/customer-edit/customer-edit.component'

@NgModule({
  declarations: [
    CustomerReportPage,
    CustomerShopReportPage,
    CustomerProfilePage
  ],
  imports: [
    IonicPageModule, BoalCommonModule,
  ],
  exports: [
    IonicPageModule, BoalCommonModule
  ],
  entryComponents:[CustomerReportPage, CustomerShopReportPage, CustomerProfilePage, OrderCustomerEditComponent]
})
export class CustomerModule {}
