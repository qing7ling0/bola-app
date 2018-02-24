import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderCreatePage } from './order-create';
import { BoalCommonModule } from '../../common/common.module'
import { OrderShoesPage } from './shoes/shoes'
import { OrderBeltPage } from './belt/belt'
import { OrderWatchStrapPage } from './watch-strap/watch-strap'
import { OrderMaintainPage } from './maintain/maintain'
import { OrderOrnamentPage } from './ornament/ornament'
import { OrderRechargePage } from './recharge/recharge'
import { OrderCustomerEditComponent } from './customer-edit/customer-edit.component'

@NgModule({
  declarations: [
    OrderCreatePage,
    OrderShoesPage,
    OrderBeltPage,
    OrderWatchStrapPage,
    OrderMaintainPage,
    OrderOrnamentPage,
    OrderRechargePage,
    OrderCustomerEditComponent
  ],
  imports: [
    IonicPageModule, BoalCommonModule
  ],
  exports: [
    IonicPageModule, BoalCommonModule
  ],
  entryComponents:[
    OrderCreatePage, 
    OrderShoesPage,
    OrderBeltPage,
    OrderWatchStrapPage,
    OrderMaintainPage,
    OrderOrnamentPage,
    OrderRechargePage,
  ]
})
export class OrderCreateModule {}
