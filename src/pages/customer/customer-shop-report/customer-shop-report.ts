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
// import { Utils } from '../../../utils/utils';
import * as graphqlTypes from '../../../api/graphqlTypes'
import * as constants from '../../../constants/constants'

const FORM_OPTIONS = (data)=> [
  {key:'region', label:'区域', defaultValue:'', validators:[]},
  {key:'shop', label:'店铺', defaultValue:'', validators:[]},
  {key:'date', label:'日期', defaultValue:'', validators:[]},
]

const SORT_LIST = [
  {value:"", label:"默认"},
  {value:"1", label:"月复购率"},
  {value:"2", label:"年复购率"},
  {value:"3", label:"年流失率"},
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
  sortDesc:boolean = false;
  sortKey: string = '';
  reportInfo: any = {
    totalCount: 0,
    monthCount: 0,
    yearCount: 0,
    notBuyCount: 0
  };
  sortKeyList:Array<any> = SORT_LIST;

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
    this.commonProvider.getCommonDataList('regionList', constants.E_COMMON_DATA_TYPES.SHOP_REGION, graphqlTypes.regionType).then((list)=>{
      this.regionList = (list || []).map(item=>{
        item.value = item._id;
        item.label = item.name;
        return item;
      });
      this.regionList.unshift({value:'', label:'无'});
    });
    this.customerProvider.getShopList().then((list)=>{
      this.shopList = (list || []).map(item=>{
        item.value = item._id;
        item.label = item.name;
        return item;
      });
      this.resetShopList();
    });
  }

  resetShopList = (): void => {
    let region = this.searchGroup.value.region;
    if (region) {
      this.currentShopList = this.shopList.filter(item=>(item.region_id&&item.region_id._id)===region);
    } else {
      this.currentShopList = this.shopList;
    }
    if (this.currentRegion !== region) {
      this.searchGroup.controls.shop.setValue('');
    }
  }

  onRegionChange = (): void => {
    let region = this.searchGroup.value.region;
    this.resetShopList();
    this.currentRegion = region;
  }

  onSortChange = (value: any): void => {
    this.sortKey = value;
    this.sort(this.sortKey);
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
    // this.customerProvider.getCustomerShopReportList(this.formatFormValue(this.searchGroup.value, this.formOptions)).then((list)=>{
    this.customerProvider.getCustomerShopReportList(this.formatFormValue(this.searchGroup.value, this.formOptions)).then((list)=>{
      this.list = this.formatList(list);
      this.sort(this.sortKey);
    });
  }

  btnSortClicked = () => {
    this.sortDesc = !this.sortDesc;
    this.sort(this.sortKey);
  }

  sort = (key: string) => {
    switch(key) {
      case "":
        this.list = this.list.sort((a,b)=> {
          let shopNamea = a.shop&&a.shop.name||'';
          let shopNameb = b.shop&&b.shop.name||'';
          let guideNamea = a.guide && a.guide.name||'';
          let guideNameb = b.guide && b.guide.name||'';
          let shopIndex = shopNamea.localeCompare(shopNameb);
          if (shopIndex === 0) {
            return guideNamea.localeCompare(guideNameb)*(this.sortDesc?1:-1);
          } {
            return shopIndex*(this.sortDesc?1:-1);
          }
        });
      break;
      case "1":
        this.list = this.list.sort((a,b)=> {
          let index = 0;
          if (a.monthCount > b.monthCount) index = -1;
          else if(a.monthCount < b.monthCount) index = 1;
          else {
            let shopNamea = a.shop&&a.shop.name||'';
            let shopNameb = b.shop&&b.shop.name||'';
            let guideNamea = a.guide && a.guide.name||'';
            let guideNameb = b.guide && b.guide.name||'';
            let shopIndex = shopNamea.localeCompare(shopNameb);
            if (shopIndex === 0) {
              return guideNamea.localeCompare(guideNameb)*(this.sortDesc?1:-1);
            } {
              return shopIndex*(this.sortDesc?1:-1);
            }
          }
          return index*(this.sortDesc?1:-1);
        });
      break;
      case "2":
      this.list = this.list.sort((a,b)=> {
        let index = 0;
        if (a.yearCount > b.yearCount) index = -1;
        else if(a.yearCount < b.yearCount) index = 1;
        else {
          let shopNamea = a.shop&&a.shop.name||'';
          let shopNameb = b.shop&&b.shop.name||'';
          let guideNamea = a.guide && a.guide.name||'';
          let guideNameb = b.guide && b.guide.name||'';
          let shopIndex = shopNamea.localeCompare(shopNameb);
          if (shopIndex === 0) {
            return guideNamea.localeCompare(guideNameb)*(this.sortDesc?1:-1);
          } {
            return shopIndex*(this.sortDesc?1:-1);
          }
        }
        return index*(this.sortDesc?1:-1);
      });
      break;
      case "3":
      this.list = this.list.sort((a,b)=> {
        let index = 0;
        if (a.notBuyCount > b.notBuyCount) index = -1;
        else if(a.notBuyCount < b.notBuyCount) index = 1;
        else {
          let shopNamea = a.shop&&a.shop.name||'';
          let shopNameb = b.shop&&b.shop.name||'';
          let guideNamea = a.guide && a.guide.name||'';
          let guideNameb = b.guide && b.guide.name||'';
          let shopIndex = shopNamea.localeCompare(shopNameb);
          if (shopIndex === 0) {
            return guideNamea.localeCompare(guideNameb)*(this.sortDesc?1:-1);
          } {
            return shopIndex*(this.sortDesc?1:-1);
          }
        }
        return index*(this.sortDesc?1:-1);
      });
      break;
    }
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
  getMonthPer = (data: any) => {
    if (!data.totalCount) return "0%";
    return new Number(data.monthCount*100/data.totalCount).toFixed(2) + '%';
  }
  // 年复购率
  getYearPer = (data: any) => {
    if (!data.totalCount) return "0%";
    return new Number(data.yearCount*100/data.totalCount).toFixed(2) + '%';
  }
  // 年流失率
  getYearNotBuyPer = (data: any) => {
    if (!data.totalCount) return "0%";
    return new Number(data.notBuyCount*100/data.totalCount).toFixed(2) + '%';
  }

}
