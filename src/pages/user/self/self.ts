import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, ToastController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import moment from 'moment'

import { OrderCustomerEditComponent } from '../../order-create/customer-edit/customer-edit.component';
import { FormValidator } from '../../../utils/form-validator'
import { CartListPage } from '../../cart-list/cart-list'
import { OrderCreatePage } from '../../order-create/order-create'
import { OrderTrackPage } from '../../order-track/order-track'
import { HeaderData } from '../../../interface/header-data';
import { CustomerProvider, CommonProvider } from '../../../providers'
import { Utils } from '../../../utils/utils';
import * as graphqlTypes from '../../../api/graphqlTypes'
import * as constants from '../../../constants/constants'

const FORM_OPTIONS = (data)=> [
  {key:'phone', label:'手机号', defaultValue:data&&data.phone||'', validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/)}]},
  {key:'name', label:'姓名', defaultValue:data&&data.name||'', validators:[{key:'required', validator:Validators.required}]},
  {key:'sex', label:'性别', defaultValue:data&&data.sex||'', validators:[{key:'required', validator:Validators.required}]},
  {key:'birthday', label:'生日', defaultValue:data&&data.birthday||'', validators:[{key:'required', validator:Validators.required}]},
  {key:'weixin', label:'微信号', defaultValue:data&&data.weixin||'', validators:[{key:'required', validator:Validators.required}]},

  {key:'country', label:'国家', defaultValue:data&&data.country||'', validators:[]},
  {key:'city', label:'城市', defaultValue:data&&data.city||'', validators:[]},
  {key:'address', label:'地址', defaultValue:data&&data.address||'', validators:[]},
  {key:'zipcode', label:'邮编', defaultValue:data&&data.zipcode||'', validators:[]},
  {key:'tags', label:'标签', defaultValue:data&&data.zipcode||'', validators:[]},
]

@Component({
  selector: 'page-customer-profile',
  templateUrl: 'customer-profile.html'
})
export class CustomerProfilePage implements OnInit {
  headerData: HeaderData = {title:'会员信息', menuEnable:false, type:'customer-profile'};

  formOptions: Array<any>;
  customerGroup: FormGroup;
  customerPhone: string = '';
  customerProfile: any = null;
  vipLevelList: Array<any>;
  vipTagList: Array<any>;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private customerProvider: CustomerProvider,
    private commonProvider: CommonProvider,
    public navParams: NavParams,
  ) {
    this.customerPhone = navParams.get('customerPhone');
  }

  ngOnInit(): void {
    this.formOptions = FORM_OPTIONS(null);
    this.customerGroup = this.formBuilder.group(FormValidator.getFormBuildGroupOptions(this.formOptions));
  }

  ionViewDidLoad(): void {
    this.commonProvider.getVipLevelList().then((data:Array<any>) => {
      if (data) {
        this.vipLevelList = data;
      }
    })
    this.commonProvider.getCommonDataList('vipTagList', constants.E_COMMON_DATA_TYPES.CUSTOMER_TAGS, graphqlTypes.salesBaseType).then((list)=>{
      this.vipTagList = (list || []).map(item=>{
        item.value = item._id;
        item.label = item.name;
        return item;
      });
      this.customerProvider.getCustomerProfile(this.customerPhone).then((data)=>{
        if (data) {
          this.setCustomer(data);
        }
      });
    });
  }

  setCustomer = (customer: any): void => {
    this.customerProfile = customer;
    if (this.customerProfile) {
      let value:any = {};
      for(let key in this.customerGroup.value) {
        value[key] = this.customerProfile[key];
      }
      value.tags = this.customerProfile.tags && this.customerProfile.tags.map(item=> {
        let tagInfo = this.vipTagList.find(tag=>tag._id === item.tag)
        return tagInfo && tagInfo.name || '';
      }).join(' ');
      this.customerGroup.setValue(value);
    }
  }
  getCurrentDiscount() {
    if (this.customerProfile) {
      for(let lv of this.vipLevelList) {
        if (lv.level === this.customerProfile.vip_level) {
          return lv.discount+'折';
        }
      }
    }
    return '无';
  }
}
