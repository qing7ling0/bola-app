import { Component, OnInit } from '@angular/core';
import { NavController, Events, ToastController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage';

import * as constants from '../../constants/constants'
import {HeaderData} from '../../interface/header-data';
import {E_ORDER_TYPE, ORDER_TYPES} from '../../constants/constants'
import { SampleListPage } from './sample-list/sample-list'
import { ApplyListPage } from './apply-list/apply-list'
import { AllotListPage } from './allot-list/allot-list'
import { CartProvider, CommonProvider } from '../../providers';

@Component({
  selector: 'page-allot',
  templateUrl: 'allot.html'
})
export class AllotPage implements OnInit {
  headerData: HeaderData = {title:'样品调拨', menuEnable:false, type:'allot'};
  pages: Array<any> =[SampleListPage, ApplyListPage, AllotListPage]
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
