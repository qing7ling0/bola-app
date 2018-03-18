/**
 * 我的申请
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, ToastController, NavParams, ModalController, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Storage } from '@ionic/storage';
import moment from 'moment'

import { OrderCustomerEditComponent } from '../../order-create/customer-edit/customer-edit.component';
import { FormValidator } from '../../../utils/form-validator'
import { HeaderData } from '../../../interface/header-data';
import { AllotProvider, CommonProvider } from '../../../providers'
import { Utils } from '../../../utils/utils';
import * as graphqlTypes from '../../../api/graphqlTypes'
import * as constants from '../../../constants/constants'

const FORM_OPTIONS = (data)=> [
  {key:'NID', label:'货号', defaultValue:data&&data.NID||'', validators:[{key:'required', validator:Validators.required}]},
]


@Component({
  selector: 'page-analyse-shop',
  templateUrl: 'analyse-shop.html'
})
export class AnalyseShopPage implements OnInit {
  headerData: HeaderData = {title:'数据分析', menuEnable:false, type:'analyse-shop'};

  formOptions: Array<any>;
  formGroup: FormGroup;
  searchNID: string = '';
  analyseList: Array<any>;
  analyseListPage: any = {page:0,pageSize:0,total:0}
  loginUserId: string = '';
  loginUserShopId: string = '';
  isShopManager: Boolean = false;
  user: any = null;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController ,
    private analyseProvider: AllotProvider,
    private commonProvider: CommonProvider,
    private storage: Storage,
    public navParams: NavParams,
    private events: Events
  ) {
    this.user = navParams.get('user');
    if (this.user) {
      this.loginUserId = this.user._id;
      if (this.user.shop) {
        this.loginUserShopId = this.user.shop._id;
      }
      this.isShopManager = this.user.manager;
    }
  }

  ngOnInit(): void {
    this.formOptions = FORM_OPTIONS(null);
    this.formGroup = this.formBuilder.group(FormValidator.getFormBuildGroupOptions(this.formOptions));
  }

  ionViewDidEnter(): void {
    this.onReqList();
  }

  onReqList() {
    // let con: any = {
    //   status:{$lt:constants.E_SAMPLE_ALLOT_STATUS.COMPLETED}
    // };
    // if (this.isShopManager) {
    //   con.accept_shop = this.loginUserShopId;
    // } else {
    //   con.accept_shop_guide = this.loginUserId;
    // }
    // this.analyseProvider.getSampleAnalyseShop(con).then((data:any) => {
    //   if (data) {
    //     this.analyseList = data;
    //   }
    // })
  }

  subscribeEvents() {
  }

}
