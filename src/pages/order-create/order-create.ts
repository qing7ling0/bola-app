import { Component, OnInit } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

import * as constants from '../../constants/constants'
import {HeaderData} from '../../interface/header-data';
import {E_ORDER_TYPE, ORDER_TYPES} from '../../constants/constants'
import { OrderShoesPage } from './shoes/shoes'
import { OrderBeltPage } from './belt/belt'
import { OrderWatchStrapPage } from './watch-strap/watch-strap'
import { OrderMaintainPage } from './maintain/maintain'
import { OrderOrnamentPage } from './ornament/ornament'
import { OrderRechargePage } from './recharge/recharge'
import { CartPayPage } from '../cart-pay/cart-pay'
import { CartProvider, CommonProvider } from '../../providers';

@Component({
  selector: 'page-order-create',
  templateUrl: 'order-create.html'
})
export class OrderCreatePage implements OnInit {
  headerData: HeaderData = {title:'订单创建', menuEnable:false, type:'cart'};
  navs = ORDER_TYPES;
  userGroup: FormGroup;
  loginUserInfo: any;
  loginUserId: string;
  loginUserShopId: string;

  constructor(
    public events: Events,
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private cartProvider: CartProvider
  ) {
    this.subscribeEvents();
  }

  ngOnInit() {
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
    if (!this.loginUserShopId) return;
    switch(nav.id) {
      case E_ORDER_TYPE.SHOES:
        this.navCtrl.push(OrderShoesPage);
        // this.events.publish('order:pay',
        //   {phone:13817280081, name:'无情', birthday:'2016-12-1', sex:'男'},
        //   [{
        //     NID:'test',
        //     price:180,
        //     s_customs: [],
        //     pics:[]
        //   }]
        // )
      break;
      case E_ORDER_TYPE.BELT:
      this.navCtrl.push(OrderBeltPage);
      break;
      case E_ORDER_TYPE.WATCH_STRAP:
      this.navCtrl.push(OrderWatchStrapPage);
      break;
      case E_ORDER_TYPE.MAINTAIN:
      this.navCtrl.push(OrderMaintainPage);
      break;
      case E_ORDER_TYPE.ORNAMENT:
      this.navCtrl.push(OrderOrnamentPage);
      break;
      case E_ORDER_TYPE.RECHARGE:
      this.navCtrl.push(OrderRechargePage);
      break;
      case E_ORDER_TYPE.DESIGN:
      break;
    }
  }

  subscribeEvents() {
    this.events.subscribe('order:pay', (customer, goodsList) => {
      this.navCtrl.push(CartPayPage, {guide:{guideId:this.loginUserId, shopId:this.loginUserShopId}, customer:customer, goodsList:goodsList});
    });

    this.events.subscribe('order:recharge', (customer, goodsList) => {
      if (goodsList.length===0) return;
      let goods = goodsList[0];
      let order:any = {};
      order.source = constants.ORDER_SOURCE[0].value;
      order.pay = goods.r_amount;
      order.pay_type = goods.pay_type;
      order.store_card_selected = false;
      order.cash_ticket_NID = ''; // 代金券

      let sub:any = {};
      sub.shop = this.loginUserShopId;
      sub.guide = this.loginUserId;
      sub.customer = customer;
      sub.r_amount = goods.r_amount;
      sub.price = goods.r_amount;
      sub.type = constants.E_ORDER_TYPE.RECHARGE;
      let subOrders = [];
      subOrders.push(sub);
      order.sub_orders = subOrders;

      this.cartProvider.addOrder(order).then((item)=> {
        if (item.code === 0) {
          this.navCtrl.popToRoot();
        }
      });
    });
    

    this.events.subscribe('user:logout', () => {
    });
  }
}
