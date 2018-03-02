import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import moment from 'moment'

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
  {key:'region', label:'区域', defaultValue:'', validators:[]},
  {key:'shop', label:'店铺', defaultValue:'', validators:[]},
  {key:'date', label:'日期', defaultValue:'', validators:[]},
]

@Component({
  selector: 'page-customer-shop-report',
  templateUrl: 'customer-shop-report.html'
})
export class CustomerShopReportPage implements OnInit {
  headerData: HeaderData = {title:'会员管理', menuEnable:false, type:'customer'};

  formOptions: Array<any>;
  searchGroup: FormGroup;
  guideId: string = "";
  list: Array<any>=[];
  regionList: Array<any>=[];
  shopList: Array<any>=[];
  currentShopList: Array<any>=[];
  currentRegion: string = '';
  reportInfo: any = {
    totalCount: 0,
    monthCount: 0,
    yearCount: 0,
    notBuyCount: 0
  };

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private customerProvider: CustomerProvider,
    private commonProvider: CommonProvider,
    public navParams: NavParams,
  ) {
    this.guideId = navParams.get('guideId');
  }

  ngOnInit(): void {
    this.formOptions = FORM_OPTIONS(null);
    this.searchGroup = this.formBuilder.group(FormValidator.getFormBuildGroupOptions(this.formOptions));
  }

  ionViewDidLoad(): void {
    this.customerProvider.getCustomerReportInfo("").then((data)=>{
      if (data) {
        this.reportInfo = data;
      }
    });
    // this.commonProvider.getCommonDataList('regionList', constants.E_COMMON_DATA_TYPES.SHOP_REGION, graphqlTypes.regionType).then((list)=>{
    //   this.regionList = list || [];
    // });
    // this.customerProvider.getShopList().then((list)=>{
    //   this.shopList = list || [];
    // });
  }

  onRegionChange = (): void => {
    let region = this.searchGroup.value.region;
    if (region) {
      this.currentShopList = this.shopList.filter(item=>item.region_id===region);
    } else {
      this.currentShopList = [];
    }
    if (this.currentRegion !== region) {
      this.searchGroup.controls.shop.setValue('');
    }
    this.currentRegion = region;
  }

  btnSearchUnionClicked = () => {
    if (!this.searchGroup.valid) {
      let message = FormValidator.getValidError(this.searchGroup.controls, this.formOptions);
      if (message) {
        this.toastCtrl.create({
          message:message,
          duration:1500,
          position:'middle'
        }).present();
      }
      return;
    }
    let values = this.searchGroup.value;

    if (values.dateBegan && values.dateEnd) {
      if (moment(values.dateEnd).isBefore(values.dateBegan)) {
        this.toastCtrl.create({
          message:'请填写正确的生日范围！',
          duration:1500,
          position:'middle'
        }).present();
        return;
      }
    }

    // this.customerProvider.getCustomerShopReportList(this.formatFormValue(this.searchGroup.value, this.formOptions)).then((list)=>{
    this.customerProvider.getCustomerShopReportList({}).then((list)=>{
      this.list = this.formatList(list);
    });
  }

  formatFormValue(values: any, options: Array<any>) {
    for(let op of options) {
      if (op.formatValue && values[op.key] !== undefined) {
        values[op.key] = op.formatValue(values[op.key]);
      }
    }
    return values;
  }

  formatList(list) {
    list = list || [];
    return list.map((item)=> {
      if (item.customer) {
        item.customer.birthday = moment(item.customer.birthday).format("YYYY/MM/DD");
      }
      item.lastCostTime = moment(item.lastCostTime).format("YYYY/MM/DD HH:mm:ss");
      return item;
    })
  }

  // 月复购率
  getMonthPer = () => {
    if (!this.reportInfo.totalCount) return "0%";
    return new Number(this.reportInfo.monthCount*100/this.reportInfo.totalCount).toFixed(2) + '%';
  }
  // 年复购率
  getYearPer = () => {
    if (!this.reportInfo.totalCount) return "0%";
    return new Number(this.reportInfo.yearCount*100/this.reportInfo.totalCount).toFixed(2) + '%';
  }
  // 年流失率
  getYearNotBuyPer = () => {
    if (!this.reportInfo.totalCount) return "0%";
    return new Number(this.reportInfo.notBuyCount*100/this.reportInfo.totalCount).toFixed(2) + '%';
  }

}
