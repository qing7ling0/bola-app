import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderCreatePage } from './order-create';
import { BoalCommonModule } from '../../common/common.module'
import { OrderShoesPage } from './shoes/shoes'

@NgModule({
  declarations: [
    OrderCreatePage,
    OrderShoesPage
  ],
  imports: [
    IonicPageModule, BoalCommonModule
  ],
  exports: [
    IonicPageModule, BoalCommonModule
  ],
  entryComponents:[OrderCreatePage]
})
export class OrderCreateModule {}
