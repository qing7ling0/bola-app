import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShopPage } from './shop';
import { BoalCommonModule } from '../../common/common.module'

@NgModule({
  declarations: [
    ShopPage
  ],
  imports: [
    IonicPageModule, BoalCommonModule
  ],
  exports: [
    IonicPageModule, BoalCommonModule
  ],
  entryComponents:[ShopPage]
})
export class ShopPageModule {}
