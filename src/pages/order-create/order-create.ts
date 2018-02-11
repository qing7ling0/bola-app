import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {HeaderData} from '../../interface/header-data';
import {E_ORDER_TYPE, ORDER_TYPES} from '../../constants/constants'
import { OrderShoesPage } from './shoes/shoes'

@Component({
  selector: 'page-order-create',
  templateUrl: 'order-create.html'
})
export class OrderCreatePage {
  headerData: HeaderData = {title:'订单创建', menuEnable:false};
  navs = ORDER_TYPES;

  constructor(public navCtrl: NavController) {}

  onNavClicked(nav: any) : void {
    switch(nav.id) {
      case E_ORDER_TYPE.SHOES:
        this.navCtrl.push(OrderShoesPage);
      break;
      case E_ORDER_TYPE.BELT:
      break;
      case E_ORDER_TYPE.WATCH_STRAP:
      break;
      case E_ORDER_TYPE.MAINTAIN:
      break;
      case E_ORDER_TYPE.ORNAMENT:
      break;
      case E_ORDER_TYPE.RECHARGE:
      break;
      case E_ORDER_TYPE.DESIGN:
      break;
    }
  }
}
