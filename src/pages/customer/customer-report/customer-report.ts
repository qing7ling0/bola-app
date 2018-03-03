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
import { CustomerProfilePage } from '../customer-profile/customer-profile';

const FORM_PHONE_OPTIONS = (data)=> [
  {key:'phone', label:'手机号', defaultValue:'', validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/)}]},
]

const FORM_OPTIONS = (data)=> [
  {key:'costMin', label:'消费金额', formatValue:(value)=>Utils.stringToInt(value), defaultValue:'', validators:[{key:'pattern', validator:Validators.pattern(/^[1-9]\d*$/)}]},
  {key:'costMax', label:'消费金额', formatValue:(value)=>Utils.stringToInt(value), defaultValue:'', validators:[{key:'pattern', validator:Validators.pattern(/^[1-9]\d*$/)}]},
  {key:'day', label:'天数', defaultValue:'', formatValue:(value)=>Utils.stringToInt(value), validators:[{key:'pattern', validator:Validators.pattern(/^[1-9]\d*$/)}]},
  {key:'costCountMin', label:'消费次数', formatValue:(value)=>Utils.stringToInt(value), defaultValue:'', validators:[{key:'pattern', validator:Validators.pattern(/^[1-9]\d*$/)}]},
  {key:'costCountMax', label:'消费次数', formatValue:(value)=>Utils.stringToInt(value), defaultValue:'', validators:[{key:'pattern', validator:Validators.pattern(/^[1-9]\d*$/)}]},
  {key:'dateBegan', label:'生日', defaultValue:'', validators:[]},
  {key:'dateEnd', label:'生日', defaultValue:'', validators:[]},
  {key:'vipTag', label:'标签', defaultValue:'', validators:[]},
]

@Component({
  selector: 'page-customer-report',
  templateUrl: 'customer-report.html'
})
export class CustomerReportPage implements OnInit {
  headerData: HeaderData = {title:'会员管理', menuEnable:false, type:'customer'};

  formOptions: Array<any>;
  formPhoneOptions: Array<any>;
  unionGroup: FormGroup;
  phoneGroup: FormGroup;
  guideId: string = "";
  list: Array<any>=[];
  vipTagList: Array<any>=[];
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
    this.unionGroup = this.formBuilder.group(FormValidator.getFormBuildGroupOptions(this.formOptions));

    this.formPhoneOptions = FORM_PHONE_OPTIONS(null);
    this.phoneGroup = this.formBuilder.group(FormValidator.getFormBuildGroupOptions(this.formPhoneOptions));
  }

  ionViewDidLoad(): void {
    this.customerProvider.getCustomerReportInfo(this.guideId).then((data)=>{
      if (data) {
        this.reportInfo = data;
      }
    });
    this.commonProvider.getCommonDataList('vipTagList', constants.E_COMMON_DATA_TYPES.CUSTOMER_TAGS, graphqlTypes.salesBaseType).then((list)=>{
      this.vipTagList = (list || []).map(item=>{
        item.value = item._id;
        item.label = item.name;
        return item;
      });
    });
  }

  btnSearchPhoneClicked = () => {
    if (!this.phoneGroup.valid) {
      let message = FormValidator.getValidError(this.phoneGroup.controls, this.formPhoneOptions);
      if (message) {
        this.toastCtrl.create({
          message:message,
          duration:1500,
          position:'middle'
        }).present();
      }
      return;
    }

    this.customerProvider.getCustomerReportList(this.guideId, this.phoneGroup.value).then((list)=>{
      this.list = this.formatList(list);
    });
  }

  btnSearchUnionClicked = () => {
    if (!this.unionGroup.valid) {
      let message = FormValidator.getValidError(this.unionGroup.controls, this.formOptions);
      if (message) {
        this.toastCtrl.create({
          message:message,
          duration:1500,
          position:'middle'
        }).present();
      }
      return;
    }
    let values = this.unionGroup.value;

    if (values.costMin && values.costMax) {
      if (values.costMin > values.costMax) {
        this.toastCtrl.create({
          message:'请填写正确的消费金额范围！',
          duration:1500,
          position:'middle'
        }).present();
        return;
      }
    }

    if (values.costCountMin && values.costCountMax) {
      if (values.costCountMin > values.costCountMax) {
        this.toastCtrl.create({
          message:'请填写正确的消费次数范围！',
          duration:1500,
          position:'middle'
        }).present();
        return;
      }
    }

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

    this.customerProvider.getCustomerReportList(this.guideId, this.formatFormValue(this.unionGroup.value, this.formOptions)).then((list)=>{
      this.list = this.formatList(list);
    });
  }

  btnItemClicked = (data) => {
    if (data && data.customer) {
      this.navCtrl.push(CustomerProfilePage, {customerPhone:data.customer.phone});
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
    let ret = list.map((item)=> {
      if (item.customer) {
        item.customer.birthday = moment(item.customer.birthday).format("YYYY/MM/DD");
      }
      item.lastCostTime = moment(item.lastCostTime).format("YYYY/MM/DD HH:mm:ss");
      return item;
    })
    ret.sort((a,b)=> {
      let namea = a.customer.name||'';
      let nameb = b.customer.name||'';
      return nameb.localeCompare(namea);
    })

    return ret;
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
