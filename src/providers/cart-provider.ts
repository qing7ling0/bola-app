import { Injectable } from '@angular/core';

import { Events, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { User } from '../interface/user'
import { NetUtils } from '../utils/net-utils'
import * as constants from '../constants/constants'
import { API } from '../api/api'
import * as orderTypes from '../api/orderTypes'


@Injectable()
export class CartProvider {

  constructor(
    public events: Events,
    public storage: Storage,
    public toastCtrl: ToastController,
    public api: API
  ) {}

  addGoods(customer: any, goods: any, tip?: boolean) {
    this.getCartList().then((result)=> {
      if (result[customer.phone]) {
        result[customer.phone].push({customer,goods});
      } else {
        let list = [];
        list.push({customer,goods});
        result.set(customer.phone, list);
      }
      this.save(result);
      this.toastCtrl.create({
        message:'添加成功！',
        duration:1500,
        position:'middle'
      }).present();
      return result;
    })
  }

  removeGoods(key:string, index:number, tip?: boolean) {
    this.getCartList().then((result)=> {
      if (result[key]) {
        let list = [];
        result[key].splice(index, 1);
        this.save(result);
        if (tip) {
          this.toastCtrl.create({
            message:'删除成功！',
            duration:1500,
            position:'middle'
          }).present();
        }
      }
      return result;
    })
  }

  getGoods(key, index) {
    this.getCartList().then((result)=> {
      if (result[key]) {
        if (index > -1 && index < result[key].length) {
          return result[key][index];
        }
      }
      return null;
    })
  }

  clear(tip?: boolean) {
    this.save({});
    if (tip) {
      this.toastCtrl.create({
        message:'清空成功！',
        duration:1500,
        position:'middle'
      }).present();
    }
  }

  getCartList(): Promise<any> {
    return this.storage.get('cart-list');
  }

  save(data: any): void {
    this.storage.set('cart-list', data);
  };

  addOrder(order: any) {
    return this.api.addDefault('order', orderTypes.orderType, order);
  }
}
