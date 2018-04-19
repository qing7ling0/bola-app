import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AnalysePage } from './analyse';
import { AnalyseShopPage } from './analyse-shop/analyse-shop';
import { AnalyseGoodsPage } from './analyse-goods/analyse-goods';
import { AnalyseVipPage } from './analyse-vip/analyse-vip';
import { BoalCommonModule } from '../../common/common.module'
import { OrderCustomerEditComponent } from '../order-create/customer-edit/customer-edit.component'

@NgModule({
  declarations: [
    AnalysePage,
    AnalyseShopPage,
    AnalyseGoodsPage,
    AnalyseVipPage
  ],
  imports: [
    IonicPageModule,
    BoalCommonModule
  ],
  exports: [
    IonicPageModule,
    BoalCommonModule
  ],
  entryComponents:[
    AnalysePage,
    OrderCustomerEditComponent
  ]
})
export class AnalyseModule {}
