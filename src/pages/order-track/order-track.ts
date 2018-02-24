import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CartListPage } from '../cart-list/cart-list'
import { OrderCreatePage } from '../order-create/order-create'
import {HeaderData} from '../../interface/header-data';

@Component({
  selector: 'page-order-track',
  templateUrl: 'order-track.html'
})
export class OrderTrackPage {
  headerData: HeaderData = {title:'订单追踪', menuEnable:false, type:'order-track'}
  loginUserId: string;
  loginUserShopId: string;
  suborderList: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    private storage: Storage,
  ) {

  }

  ionViewDidLoad(): void {
    this.storage.get('user').then((data) => {
      this.loginUserId = data._id;
      if (data.shop) {
        this.loginUserShopId = data.shop._id;
      }
    })
  }

  initStep = (order) => {

  }

  // 搜索订单列表
  searchOrderList = (keyword) => {

  }

  // 搜索
  btnSearchClick () {

  }
}
