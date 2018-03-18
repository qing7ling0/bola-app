import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnalysePage } from './analyse';
import { AnalyseShopPage } from './analyse-shop/analyse-shop';
import { BoalCommonModule } from '../../common/common.module'
import { OrderCustomerEditComponent } from '../order-create/customer-edit/customer-edit.component'

@NgModule({
  declarations: [
    AnalysePage,
    AnalyseShopPage,
    
  ],
  imports: [
    IonicPageModule, BoalCommonModule,
  ],
  exports: [
    IonicPageModule, BoalCommonModule
  ],
  entryComponents:[AnalysePage, AnalyseShopPage, OrderCustomerEditComponent]
})
export class AnalyseModule {}
