import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CartPayPage } from './cart-pay';
import { BoalCommonModule } from '../../common/common.module'

@NgModule({
  declarations: [
    CartPayPage
  ],
  imports: [
    IonicPageModule, BoalCommonModule
  ],
  exports: [
    IonicPageModule, BoalCommonModule
  ],
  entryComponents:[CartPayPage]
})
export class CartPayModule {}
