import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CartPayPage } from './cart-pay';
import { SignaturePage } from './signature/signature';
import { BoalCommonModule } from '../../common/common.module'

@NgModule({
  declarations: [
    CartPayPage,
    SignaturePage
  ],
  imports: [
    IonicPageModule, BoalCommonModule
  ],
  exports: [
    IonicPageModule, BoalCommonModule
  ],
  entryComponents:[CartPayPage, SignaturePage]
})
export class CartPayModule {}
