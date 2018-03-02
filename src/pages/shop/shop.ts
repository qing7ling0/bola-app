import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { CartListPage } from '../cart-list/cart-list'
import { OrderCreatePage } from '../order-create/order-create'
import { OrderTrackPage } from '../order-track/order-track'
import { CustomerReportPage } from '../customer/customer-report/customer-report'
import { CustomerShopReportPage } from '../customer/customer-shop-report/customer-shop-report'
import {HeaderData} from '../../interface/header-data';
import * as constants from '../../constants/constants'

const NAVS = [
  { id:'create', icon:'icon-order', label:'创建订单', url:'/create' },
  { id:'cart', icon:'icon-cart', label:'购物车', url:'/cart' },
  { id:'track', icon:'icon-track', label:'订单追踪', url:'/track' },
  // { id:'personal', icon:'icon-personal', label:'个人管理', url:'/personal' },
  { id:'vip', icon:'icon-user', label:'会员管理', url:'/vip' },
  // { id:'allot', icon:'icon-allot', label:'样品调拨', url:'/allot' }
]
@Component({
  selector: 'page-shop',
  templateUrl: 'shop.html'
})
export class ShopPage {
  headerData: HeaderData = {title:'店铺管理', menuEnable:false, type:'shop'}
  navs = NAVS;
  loginUserInfo: any;
  loginUserId: string;
  loginUserShopId: string;

  constructor(
    public navCtrl: NavController,
    private storage: Storage
  ) {

  }

  ionViewDidEnter(): void {
    this.storage.get('user').then((data) => {
      this.loginUserInfo = data;
      this.loginUserId = data._id;
      if (data.shop) {
        this.loginUserShopId = data.shop._id;
      }
    })
  }

  onNavClicked(nav: any) : void {
    switch(nav.id) {
      case 'create':
      this.navCtrl.push(OrderCreatePage);
      break;
      case 'cart':
      this.navCtrl.push(CartListPage);
      break;
      case 'track':
      this.navCtrl.push(OrderTrackPage);
      break;
      case 'vip':
      if (this.loginUserInfo.user_type === constants.USER_TYPES.admin ||this.loginUserInfo.user_type === constants.USER_TYPES.operate) {
        this.navCtrl.push(CustomerShopReportPage, {guideId:this.loginUserId, shopId:this.loginUserShopId});
      } else {
        this.navCtrl.push(CustomerReportPage, {guideId:this.loginUserId, shopId:this.loginUserShopId});
      }
      break;
    }
  }

}
