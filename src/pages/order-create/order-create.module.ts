import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderCreatePage } from './order-create';
import { BoalCommonModule } from '../../common/common.module'
import { OrderShoesPage } from './shoes/shoes'
import { OrderCustomerEditComponent } from './customer-edit/customer-edit.component'

@NgModule({
  declarations: [
    OrderCreatePage,
    OrderShoesPage,
    OrderCustomerEditComponent
  ],
  imports: [
    IonicPageModule, BoalCommonModule
  ],
  exports: [
    IonicPageModule, BoalCommonModule
  ],
  entryComponents:[OrderCreatePage, OrderShoesPage]
})
export class OrderCreateModule {}
