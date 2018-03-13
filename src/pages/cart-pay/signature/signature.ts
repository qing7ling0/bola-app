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
  selector: 'page-signature',
  templateUrl: 'signature.html'
})
export class SignaturePage implements OnInit {
  headerData: HeaderData = {title:'样品调拨', menuEnable:false, type:'apply-list'};

  formOptions: Array<any>;
  formGroup: FormGroup;
  searchNID: string = '';
  applyList: Array<any>;
  applyListPage: any = {page:0,pageSize:0,total:0}
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

  ionViewDidLoad(): void {
    let con: any = {
      status:{$lt:constants.E_SAMPLE_ALLOT_STATUS.COMPLETED}
    };
    if (this.isShopManager) {
      con.apply_shop = this.loginUserShopId;
    } else {
      con.apply_shop_guide = this.loginUserId;
    }
    this.allotProvider.getSampleAllotList(con).then((data:any) => {
      if (data) {
        this.applyList = data.list;
        this.applyListPage = data.page;
      }
    })
  }

  getSampleIcon = (data: any): string => {
    if (data && data.pics && data.pics.length > 0) {
      return constants.API_FILE_SERVER_ADDRESS + '/' + data.pics[0];
    }
    return '';
  }

  getSampleRightBtnLabel = (data: any): string => {
    if (data.left_count > 0 && data.right_count > 0) {
      return '出售';
    }

    return '';
  }

  onItemRightClicked = (data: any) => {

  }

}
