import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerReportPage } from './customer-report/customer-report';
import { CustomerShopReportPage } from './customer-shop-report/customer-shop-report';
import { BoalCommonModule } from '../../common/common.module'

@NgModule({
  declarations: [
    CustomerReportPage,
    CustomerShopReportPage,
  ],
  imports: [
    IonicPageModule, BoalCommonModule
  ],
  exports: [
    IonicPageModule, BoalCommonModule
  ],
  entryComponents:[CustomerReportPage, CustomerShopReportPage]
})
export class CustomerModule {}
