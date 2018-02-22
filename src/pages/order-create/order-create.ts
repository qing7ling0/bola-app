import { Component, OnInit } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

import * as constants from '../../constants/constants'
import {HeaderData} from '../../interface/header-data';
import {E_ORDER_TYPE, ORDER_TYPES} from '../../constants/constants'
import { OrderShoesPage } from './shoes/shoes'
import { CartPayPage } from '../cart-pay/cart-pay'

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
    private storage: Storage
  ) {
    this.subscribeEvents();
  }

  ngOnInit() {
  }

  ionViewDidEnter(): void {
    this.storage.get('user').then((data) => {
      this.loginUserInfo = data;
      this.loginUserId = data.shop._id;
      if (data.shop) {
        this.loginUserShopId = data._id;
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

  subscribeEvents() {
    this.events.subscribe('order:pay', (customer, goodsList) => {
      this.navCtrl.push(CartPayPage, {guide:{guideId:this.loginUserId, shopId:this.loginUserShopId}, customer:customer, goodsList:goodsList});
    });

    this.events.subscribe('user:logout', () => {
    });
  }
}
