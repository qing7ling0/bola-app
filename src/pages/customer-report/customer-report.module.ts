import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomerReportPage } from './customer-report';
import { BoalCommonModule } from '../../common/common.module'

@NgModule({
  declarations: [
    CustomerReportPage
  ],
  imports: [
    IonicPageModule, BoalCommonModule
  ],
  exports: [
    IonicPageModule, BoalCommonModule
  ],
  entryComponents:[CustomerReportPage]
})
export class CustomerReportModule {}
