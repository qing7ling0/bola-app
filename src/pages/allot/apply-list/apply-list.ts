/**
 * 我的申请
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, ToastController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Storage } from '@ionic/storage';
import moment from 'moment'

import { OrderCustomerEditComponent } from '../../order-create/customer-edit/customer-edit.component';
import { FormValidator } from '../../../utils/form-validator'
import { CartListPage } from '../../cart-list/cart-list'
import { OrderCreatePage } from '../../order-create/order-create'
import { OrderTrackPage } from '../../order-track/order-track'
import { HeaderData } from '../../../interface/header-data';
import { AllotProvider, CommonProvider } from '../../../providers'
import { Utils } from '../../../utils/utils';
import * as graphqlTypes from '../../../api/graphqlTypes'
import * as constants from '../../../constants/constants'

const FORM_OPTIONS = (data)=> [
  {key:'NID', label:'货号', defaultValue:data&&data.NID||'', validators:[{key:'required', validator:Validators.required}]},
]


@Component({
  selector: 'page-apply-list',
  templateUrl: 'apply-list.html'
})
export class ApplyListPage implements OnInit {
  headerData: HeaderData = {title:'样品调拨', menuEnable:false, type:'apply-list'};

  formOptions: Array<any>;
  formGroup: FormGroup;
  searchNID: string = '';
  applyList: Array<any>;
  loginUserId: string = '';
  loginUserShopId: string = '';
  isShopManager: Boolean = false;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private allotProvider: AllotProvider,
    private commonProvider: CommonProvider,
    private storage: Storage,
    public navParams: NavParams,
  ) {
    let user = navParams.get('user');
    if (user) {
      this.loginUserId = user._id;
      if (user.shop) {
        this.loginUserShopId = user.shop._id;
      }
      this.isShopManager = user.manager;
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
    let con: any = {
      status:{$lt:constants.E_SAMPLE_ALLOT_STATUS.COMPLETED}
    };
    con.apply_shop = this.loginUserShopId;
    this.allotProvider.getSampleAllotList(con).then((data:any) => {
      if (data) {
        this.applyList = data;
      }
    })
  }

  getSampleIcon = (data: any): string => {
    if (data && data.sample && data.sample.pics && data.sample.pics.length > 0) {
      return constants.API_FILE_SERVER_ADDRESS + '/' + data.sample.pics[0];
    }
    return '';
  }

  getAllotStep = (data: any): number => {
    if (data) {
      if (data.status <= constants.E_SAMPLE_ALLOT_STATUS.REVIEW) return 0;
      if (data.status <= constants.E_SAMPLE_ALLOT_STATUS.REVIEW_FINISH) return 1;
      if (data.status <= constants.E_SAMPLE_ALLOT_STATUS.TRANSPORT) return 2;
    }
    return 0;
  }

  getSampleShoesCountClass = (data: any): string => {
    if (data) {
      if (data.left_count > 0 && data.right_count > 0) return 'both';
      if (data.left_count > 0 && data.right_count === 0) return 'left';
      if (data.left_count === 0 && data.right_count > 0) return 'right';
    }
    return '';
  }

  getSampleRightBtnLabel = (data: any): string => {
    if (data && data.status === constants.E_SAMPLE_ALLOT_STATUS.TRANSPORT) {
      return '入库';
    }

    return '';
  }

  onItemRightClicked = (data: any) => {
    if (data && data.status === constants.E_SAMPLE_ALLOT_STATUS.TRANSPORT) {
      this.allotProvider.sampleAllotInbound(data._id).then(data=>{
        if (data.code === 0) {
          this.onReqList();
        }
      });
    }
  }

}
