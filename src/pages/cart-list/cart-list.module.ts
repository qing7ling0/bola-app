import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CartListPage } from './cart-list';
import { BoalCommonModule } from '../../common/common.module'

@NgModule({
  declarations: [
    CartListPage
  ],
  imports: [
    IonicPageModule, BoalCommonModule
  ],
  exports: [
    IonicPageModule, BoalCommonModule
  ],
  entryComponents:[CartListPage]
})
export class CartListModule {}
