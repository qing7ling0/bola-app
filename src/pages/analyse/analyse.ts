import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, Events, ToastController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

import * as constants from '../../constants/constants'
import {HeaderData} from '../../interface/header-data';
import {E_ORDER_TYPE, ORDER_TYPES} from '../../constants/constants'
import { AnalyseShopPage } from './analyse-shop/analyse-shop'
import { AnalyseGoodsPage } from './analyse-goods/analyse-goods'
import { CartProvider, CommonProvider } from '../../providers';


const E_DATE_TYPES = {
  DAY:1,
  WEEK:2,
  MONTH:3,
  YEAR:4
}

const E_ANALYSE_TYPES = {
  SHOP:"1",
  GOODS:"2",
  VIP:"3"
}

const E_ANALYSE_DATAS = [
  {value:E_ANALYSE_TYPES.SHOP, label:'店铺销售汇总'},
  {value:E_ANALYSE_TYPES.GOODS, label:'商品销售汇总'},
  {value:E_ANALYSE_TYPES.VIP, label:'会员销售汇总'}
]

@Component({
  selector: 'page-analyse',
  templateUrl: 'analyse.html'
})
export class AnalysePage implements OnInit {
  headerData: HeaderData = {title:'数据分析', menuEnable:false, type:'analyse'};
  pages: Array<any> =[AnalyseShopPage]
  user:any = null;
  currentDateType: number = E_DATE_TYPES.DAY;
  currentAnalyseType: string = E_ANALYSE_TYPES.SHOP;
  analyseTypeList: Array<any> = E_ANALYSE_DATAS;

  @ViewChild(AnalyseShopPage) analyseShopPage: AnalyseShopPage
  @ViewChild(AnalyseGoodsPage) analyseGoodsPage: AnalyseGoodsPage

  constructor(
    public events: Events,
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private storage: Storage,
    private cartProvider: CartProvider,
    public navParams: NavParams,
    private toastCtrl: ToastController
  ) {
    this.user = navParams.get('user');
  }

  ngOnInit() {
  }

  ionViewDidEnter(): void {
  }

  onLoadSuccess = (): void => {
    this.reqRefresh();
  }

  reqRefresh(): void {
    switch(this.currentAnalyseType) {
      case E_ANALYSE_TYPES.SHOP:
      this.analyseShopPage.reqRefresh(this.currentDateType);
      break;
      case E_ANALYSE_TYPES.GOODS:
      this.analyseGoodsPage.reqRefresh(this.currentDateType);
      break;
      case E_ANALYSE_TYPES.VIP:
      break;
    }
  }

  isShopType = () => {
    return this.currentAnalyseType === E_ANALYSE_TYPES.SHOP;
  }

  isGoodsType = () => {
    return this.currentAnalyseType === E_ANALYSE_TYPES.GOODS;
  }

  isVipType = () => {
    return this.currentAnalyseType === E_ANALYSE_TYPES.VIP;
  }

  onAnalyseTypeChange = () => {

  }

  onBtnDayClicked = () => {
    this.currentDateType = E_DATE_TYPES.DAY;
    this.reqRefresh();
  }

  onBtnWeekClicked = () => {
    this.currentDateType = E_DATE_TYPES.WEEK;
    this.reqRefresh();
  }

  onBtnMonthClicked = () => {
    this.currentDateType = E_DATE_TYPES.MONTH;
    this.reqRefresh();
  }

  onBtnYearClicked = () => {
    this.currentDateType = E_DATE_TYPES.YEAR;
    this.reqRefresh();
  }
}
