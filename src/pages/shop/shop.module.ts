import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShopPage } from './shop';

@NgModule({
  declarations: [
    ShopPage,
  ],
  imports: [
    IonicPageModule
  ],
  exports: [
    IonicPageModule
  ],
  entryComponents:[ShopPage]
})
export class ShopPageModule {}
