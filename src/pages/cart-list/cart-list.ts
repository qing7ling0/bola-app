import { Component } from '@angular/core';
import { NavController, Events, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { OrderCreatePage } from '../order-create/order-create'
import { CartPayPage } from '../cart-pay/cart-pay';
import {HeaderData} from '../../interface/header-data';
import { CartProvider } from '../../providers';
import { ShopPage } from '../shop/shop';
import { OrderShoesPage } from '../order-create/shoes/shoes';
import { OrderShoesDesignPage } from '../order-create/shoes-design/shoes-design'
import { OrderBeltPage } from '../order-create/belt/belt'
import { OrderWatchStrapPage } from '../order-create/watch-strap/watch-strap'
import { OrderMaintainPage } from '../order-create/maintain/maintain'
import { OrderOrnamentPage } from '../order-create/ornament/ornament'
import { OrderRechargePage } from '../order-create/recharge/recharge'
import * as constants from '../../constants/constants'


const NAVS = [
  { id:'create', icon:'icon-order', label:'创建订单', url:'/create' },
  { id:'cart', icon:'icon-cart', label:'购物车', url:'/cart' },
  { id:'track', icon:'icon-track', label:'订单追踪', url:'/track' },
  { id:'personal', icon:'icon-personal', label:'个人管理', url:'/personal' },
  { id:'vip', icon:'icon-user', label:'会员管理', url:'/vip' },
  { id:'allot', icon:'icon-allot', label:'样品调拨', url:'/allot' }
]
@Component({
  selector: 'page-cart-list',
  templateUrl: 'cart-list.html'
})
export class CartListPage {
  headerData: HeaderData = {title:'购物车列表', menuEnable:false, type:'cart-clear'}
  navs = NAVS;
  cartList: Array<any> = [];
  currentIndex: number = -1;
  loginUserId: string = '';
  loginUserShopId: string = '';

  constructor(
    public navCtrl: NavController,
    private cartProvider: CartProvider,
    private events: Events,
    private storage: Storage,
    private alertController: AlertController
  ) {
    // this.cartProvider.clear();
    this.storage.get('user').then((data) => {
      this.loginUserId = data._id;
      if (data.shop) {
        this.loginUserShopId = data.shop._id;
      }
    })

    this.subscribeEvents();
  }

  ionViewDidLoad(): void {
    this.cartProvider.getCartList().then((data: any) => {
      if (data) {
        this.cartList = [];
        for(let key in data) {
          if (data[key] && data[key].list.length > 0) {
            this.cartList.push({customer:data[key].customer, goods:data[key].list.map((item)=>{
              let ret = item;
              ret.cart_select = false;
              return ret;
            })});
          }
        }
      }
    })
  }

  onGoodsSelect = (index: number, goods: any) => {
    if (this.currentIndex !== index && goods.cart_select) {
      if (this.currentIndex>-1 && this.currentIndex<this.cartList.length) {
        let list = this.cartList[this.currentIndex];
        for(let item of list.goods) {
          item.cart_select = false;
        }
      }

      this.currentIndex = index;
    }
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

  getPayPrice = () => {
    let price = 0;
    if (this.currentIndex>-1 && this.currentIndex < this.cartList.length) {
      let list = this.cartList[this.currentIndex];
      for(let item of list.goods) {
        if (item.cart_select) {
          price += this.getGoodsPayPrice(item);
        }
      }
    }
    return price;
  }

  btnItemClick = (customerIndex, goodsIndex): void => {

    if (customerIndex>-1 && customerIndex < this.cartList.length) {
      let list = this.cartList[customerIndex];
      let cartInfo = {cart:true, customerIndex, goodsIndex};
      let goods = list.goods[goodsIndex];
      let customer = list.customer;
      switch(goods.type) {
        case constants.E_ORDER_TYPE.SHOES:
        this.navCtrl.push(OrderShoesPage, {cartInfo, customer, goods})
        break;
        case constants.E_ORDER_TYPE.BELT:
        this.navCtrl.push(OrderBeltPage, {cartInfo, customer, goods})
        break;
        case constants.E_ORDER_TYPE.WATCH_STRAP:
        this.navCtrl.push(OrderWatchStrapPage, {cartInfo, customer, goods})
        break;
        case constants.E_ORDER_TYPE.MAINTAIN:
        this.navCtrl.push(OrderMaintainPage, {cartInfo, customer, goods})
        break;
        case constants.E_ORDER_TYPE.ORNAMENT:
        this.navCtrl.push(OrderOrnamentPage, {cartInfo, customer, goods})
        break;
        case constants.E_ORDER_TYPE.DESIGN:
        this.navCtrl.push(OrderShoesDesignPage, {cartInfo, customer, goods})
        break;
      }
    }
  }

  onDelCartItems = () => {
    if (this.currentIndex>-1 && this.currentIndex < this.cartList.length) {
      let data = this.cartList[this.currentIndex];
      for(let i=0; i<data.goods.length; i++) {
        if (data.goods[i].cart_select) {
          data.goods.splice(i, 1);
          this.cartProvider.removeGoods(data.customer.phone, i);
          i--;
        }
      }
      if (!data.goods || data.goods.length === 0) {
        this.cartList.splice(this.currentIndex, 1);
        this.currentIndex = -1;
      }
    }
  }

  btnDelClick = () => {
    let alert = this.alertController.create({
      title: '警告',
      subTitle: '确定要删除吗？',
      buttons: [
        {
          text: '取消',
          handler: data => {
          }
        },
        {
          text: '确定',
          handler: data => {
            this.onDelCartItems();
          }
        }
      ]
    });
    alert.present();
  }

  btnPayClick = (): void => {
    let goodsList = [];
    let customer = null;
    if (this.currentIndex>-1 && this.currentIndex < this.cartList.length) {
      let list = this.cartList[this.currentIndex];
      customer = list.customer;
      for(let item of list.goods) {
        if (item.cart_select) {
          let va: any = {};
          for(let key in item) {
            if (key !== 'cart_select') {
              va[key] = item[key];
            }
          }

          goodsList.push(va);
        }
      }
    }
    if (customer && goodsList.length > 0 && this.loginUserShopId) {
      this.navCtrl.push(CartPayPage, {guide:{guideId:this.loginUserId, shopId:this.loginUserShopId}, customer:customer, goodsList:goodsList});

      this.events.publish('order:pay', this.cartList, goodsList);
    }
  }

  subscribeEvents() {
    this.events.subscribe('cart:update-goods', (customerIndex, customer, index, goods) => {
      if (customerIndex>-1 && customerIndex < this.cartList.length) {
        let list = this.cartList[customerIndex];
        this.cartProvider.updateGoods(list.customer.phone, customer, index, goods).then((data)=> {
        });
        list.customer = customer;
        if (index >-1 && index < list.goods.length) {
          goods.cart_select = list.goods[index].cart_select;
          list.goods[index] = goods;
        }
      }
    });

    this.events.subscribe('order:success', () => {
      this.onDelCartItems();
    });
  }

}
