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
  selector: 'page-sample-list',
  templateUrl: 'sample-list.html'
})
export class SampleListPage implements OnInit {
  headerData: HeaderData = {title:'样品调拨', menuEnable:false, type:'sample-list'};

  formOptions: Array<any>;
  formGroup: FormGroup;
  searchNID: string = '';
  sampleList: Array<any> = [];
  sampleListPage: any = {page:0,pageSize:0,total:0}
  loginUserId: string = '';
  loginUserShopId: string = '';
  searchList: Array<any> = [];
  searchListPage: any = {page:0,pageSize:0,total:0}
  searching: boolean = false;

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
    this.allotProvider.getSampleList({shop:this.loginUserShopId, $or:[{left_count:{$gt:0}}, {right_count:{$gt:0}}]}).then((data:any) => {
      if (data) {
        this.sampleList = data.list;
        this.sampleListPage = data.page;
      }
    })
  }

  getSampleIcon = (data: any): string => {
    if (data && data.pics && data.pics.length > 0) {
      return constants.API_FILE_SERVER_ADDRESS + '/' + data.pics[0];
    }
    return '';
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
    if (data.shop._id === this.loginUserShopId) {
      if (data.left_count > 0 && data.right_count > 0) {
        return '出售';
      }
    } else {
      if (data.left_count > 0 || data.right_count > 0) {
        return '申请调拨';
      }
    }
  
    return '';
  }

  onReqSearchList() {
    if (this.formGroup.value.NID) {
      this.allotProvider.getSampleList({shop:{$ne:this.loginUserShopId},NID:{$regex:`/${this.formGroup.value.NID}/i`}}, 1, 20).then((data:any) => {
        if (data) {
          this.searchListPage = data.page;
          this.searchList = [];
          data.list.forEach(element => {
            if (element.left_count > 0 && element.right_count > 0) {
              // 左右拆分开
              let info = Object.assign({}, element);
              info.right_count = 0;
              this.searchList.push(info);
              info = Object.assign({}, element);
              info.left_count = 0;
              this.searchList.push(info);
            } else if (element.left_count > 0 || element.right_count > 0) {
              this.searchList.push(element);
            }
          });
        }
        this.searching = true;
      })
    }
  }

  onBtnSearchClicked = () => {
    if (this.searching) {
      let value = {NID:''};
      this.formGroup.setValue(value);
      this.searching = false;
    } else {
      this.onReqSearchList();
    }
  }

  onItemRightClicked = (data: any) => {
    if (data.shop._id === this.loginUserShopId) {
      if (data.left_count > 0 && data.right_count > 0) {
        return '出售';
      }
    } else {
      if (data.left_count > 0 || data.right_count > 0) {

        let value:any = {};
        value.sample = data._id;
        value.left_count = data.left_count;
        value.right_count = data.right_count;
        value.apply_shop = this.loginUserShopId;
        value.apply_shop_guide = this.loginUserId;

        // return '申请调拨';
        this.allotProvider.sampleAllotApply(value).then(data=>{
          if (data.code === 0) {
            this.onReqSearchList();
            this.onReqList();
          }
        });
      }
    }
  }

}
