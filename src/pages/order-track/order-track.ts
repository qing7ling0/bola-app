import { Component } from '@angular/core';
import { NavController, ToastController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { CartListPage } from '../cart-list/cart-list'
import { OrderCreatePage } from '../order-create/order-create'
import {HeaderData} from '../../interface/header-data';
import { CommonProvider, CustomerProvider } from '../../providers';
import * as constants from '../../constants/constants'
import * as validates from '../../utils/validate'


@Component({
  selector: 'page-order-track',
  templateUrl: 'order-track.html'
})
export class OrderTrackPage {
  headerData: HeaderData = {title:'订单追踪', menuEnable:false, type:'order-track'}
  loginUserId: string;
  loginUserShopId: string;
  suborderList: Array<any> = [];
  search_keyword: string = '';

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    private storage: Storage,
    private commonProvider: CommonProvider,
    private customerProvider: CustomerProvider,
    private events: Events
  ) {
    this.subscribeEvents();
  }

  ionViewDidLoad(): void {
    this.storage.get('user').then((data) => {
      this.loginUserId = data._id;
      if (data.shop) {
        this.loginUserShopId = data.shop._id;
      }
      this.searchOrderList();
    })
  }

  initStep = (order) => {

  }

  // 搜索订单列表
  searchOrderList = () => {
    if (!this.loginUserId) return;

    let keyword = this.search_keyword;
    let con: any = {guide:this.loginUserId, state:{$lt:constants.E_ORDER_STATUS.COMPLETED}, type:{$in:[constants.E_ORDER_TYPE.SHOES, constants.E_ORDER_TYPE.DESIGN]}};
    if (keyword) {
      if (validates.isMobile(keyword)) {
        this.customerProvider.getCustomerProfile(keyword).then((data) => {
          if (data) {
            con.customer = data._id;
            this.commonProvider.getSuborderList(con).then((list)=>{
              this.suborderList = list;
              this.suborderList&&this.suborderList.sort((a,b)=>{
                let dt1 = new Date(a.create_time).getTime();
                let dt2 = new Date(b.create_time).getTime();
                return dt1 > dt2 ? -1 : 1;
              })
            });
          } else {
            this.toastCtrl.create({
              message:'没有此会员',
              duration:1500,
              position:'middle'
            }).present();
          }
        })
      } else {
        con.sub_order_id = keyword;
        this.commonProvider.getSuborderList(con).then((list)=>{
          this.suborderList = list;
          if (this.suborderList && this.suborderList.length > 0) {
            this.suborderList&&this.suborderList.sort((a,b)=>{
              let dt1 = new Date(a.create_time).getTime();
              let dt2 = new Date(b.create_time).getTime();
              return dt1 > dt2 ? -1 : 1;
            })
          } else {
            this.toastCtrl.create({
              message:'此订单号不存在!',
              duration:1500,
              position:'middle'
            }).present();
          }
        });
      }
    } else {
      this.commonProvider.getSuborderList(con).then((list)=>{
        this.suborderList = list;
        this.suborderList&&this.suborderList.sort((a,b)=>{
          let dt1 = new Date(a.create_time).getTime();
          let dt2 = new Date(b.create_time).getTime();
          return dt1 > dt2 ? -1 : 1;
        })
      });
    }
  }

  // 搜索
  btnSearchClicked () {
    this.searchOrderList();
  }

  subscribeEvents () {
    this.events.subscribe('order-track:refresh', ()=> {
      this.searchOrderList();
    })
  }
}
