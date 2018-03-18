import { Component, OnInit } from '@angular/core';
import { NavController, Events, ToastController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

import * as constants from '../../constants/constants'
import {HeaderData} from '../../interface/header-data';
import {E_ORDER_TYPE, ORDER_TYPES} from '../../constants/constants'
import { AnalyseShopPage } from './analyse-shop/analyse-shop'
import { CartProvider, CommonProvider } from '../../providers';

@Component({
  selector: 'page-analyse',
  templateUrl: 'analyse.html'
})
export class AnalysePage implements OnInit {
  headerData: HeaderData = {title:'数据分析', menuEnable:false, type:'analyse'};
  pages: Array<any> =[AnalyseShopPage]
  user:any = null;

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
}
