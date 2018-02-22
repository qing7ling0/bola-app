import { Component } from '@angular/core';
import { NavController, NavParams, ToastController} from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { OrderCreatePage } from '../order-create/order-create'
import {HeaderData} from '../../interface/header-data';
import * as constants from '../../constants/constants'
import { CartProvider, CommonProvider } from '../../providers';


@Component({
  selector: 'page-cart-pay',
  templateUrl: 'cart-pay.html'
})
export class CartPayPage {
  headerData: HeaderData = {title:'购物车结算', menuEnable:true, type:''};
  goodsList: Array<any>;
  customer: any;
  isUseStoreCard: boolean = false;
  isHasNeiGua: boolean = false;
  neiGuaPeopleData: any = null;
  payType: string = '';
  payInfo: any = {payPriceLabel:'0.00', discountPriceLabel:'0.00'};
  vipLevelList: Array<any>;
  FILE_URL: string = constants.API_FILE_SERVER_ADDRESS + '/';
  shopId: string = '';
  guideId: string = '';
  payTypeList: Array<any> = constants.PAY_TYPE;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    private cartProvider: CartProvider,
    private commonProvider: CommonProvider,
    private storage: Storage
  ) {
    this.goodsList = navParams.get('goodsList');
    this.customer = navParams.get('customer');
    let guide = navParams.get('guide');
    if (guide) {
      this.shopId = guide.guideId;
      this.guideId = guide.shopId;
    }
  }

  ionViewDidEnter(): void {
    this.commonProvider.getVipLevelList().then((data:Array<any>) => {
      if (data) {
        this.vipLevelList = data;

        this.calcPayMount();
      }
    })
  }

  getGoodsPayPrice(goods: any): number {
    if (!goods) 0;
    let price = 0;
    price = goods.price;
    price += this.getGoodsCustomPrice(goods);
    if (goods.urgent) {
      price += goods.urgent.price;
    }

    return price;
  }

  getGoodsCustomPrice(goods: any): number {
    let price = 0;
    if (goods.s_customs) {
      for(let cu of goods.s_customs) {
        price += cu.price;
      }
    }

    return price;
  }

  onUseStoreCardChange = () => {
    this.calcPayMount();
  }
  onHasNeiGuaChange = () => {
    this.calcPayMount();
  }

  calcPayMount = ()=> {
    let payInfo = this.payInfo;
    payInfo.price = 0;
    payInfo.realPrice = 0;
    payInfo.customPrice = 0;
    payInfo.urgentPrice = 0;
    payInfo.discountPrice = 0;

    let price = 0;
    for(let good of this.goodsList) {
      payInfo.price += good.price;
      if (good.s_customs) {
        for(let cus of good.s_customs) {
          payInfo.customPrice += cus.price;
        }
      }

      if (good.urgent) {
        payInfo.urgentPrice = good.urgent.price;
      }
    }

    let discount = 1;
    if (!this.isUseStoreCard) {
      let list = this.vipLevelList || [];
      for(let lv of list) {
        if (lv.level === this.customer.vip_level) {
          discount = lv.discount/10;
          break;
        }
      }
    }
    payInfo.discount = discount;
    payInfo.realPrice = (payInfo.price * discount);
    payInfo.discountPrice = (payInfo.price - payInfo.realPrice);
    payInfo.payPrice = payInfo.realPrice + payInfo.customPrice + payInfo.urgentPrice;
    payInfo.payPriceLabel = new Number(payInfo.payPrice).toFixed(2);
    payInfo.discountPriceLabel = new Number(payInfo.discountPrice).toFixed(2);
  }

  pay() {
    if (!this.shopId) return;
    if (!this.payType) {
      this.toastCtrl.create({
        message:'请选择支付方式！',
        duration:1500,
        position:'middle'
      }).present();
      return;
    }
    this.calcPayMount();
    let payInfo = this.payInfo;
    let order:any = {};
    order.source = constants.ORDER_SOURCE[0].value;
    order.pay = payInfo.realPrice + payInfo.customPrice + payInfo.urgentPrice;
    order.pay_type = this.payType;
    order.store_card_selected = this.isUseStoreCard;
    order.cash_ticket_NID = ''; // 代金券

    let subOrders = [];
    for(let good of this.goodsList) {
      let sub = {...good};
      sub.shop = this.shopId;
      sub.guide = this.guideId;
      sub.customer = this.customer;
      subOrders.push(sub);
    }
    order.sub_orders = subOrders;

    this.cartProvider.addOrder(order).then((item)=> {

    });
  }

}
