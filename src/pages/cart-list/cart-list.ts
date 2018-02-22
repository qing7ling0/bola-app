import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { OrderCreatePage } from '../order-create/order-create'
import {HeaderData} from '../../interface/header-data';
import { CartProvider } from '../../providers';

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

  constructor(
    public navCtrl: NavController,
    private cartProvider: CartProvider
  ) {

  }

  ionViewDidEnter(): void {
    this.cartProvider.getCartList().then((data:Array<any>) => {
      if (data) {
        this.cartList = data;
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

}
