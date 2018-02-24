import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { NavController, ToastController, Events, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { ImagePicker } from '@ionic-native/image-picker'

import { API } from '../../../api/api'
import { Utils } from '../../../utils/utils';
import { CustomerData } from '../../../interface/customer-data'
import { FormValidator } from '../../../utils/form-validator';
import { CustomerProvider, CommonProvider, CartProvider } from '../../../providers'
import * as commonUtils from '../../../utils/common-utils'
import {HeaderData} from '../../../interface/header-data';
import { orderType } from '../../../api/orderTypes';
import * as constants from '../../../constants/constants'
import { OrderCustomerEditComponent } from '../customer-edit/customer-edit.component';
import { API_FILE_SERVER_ADDRESS, SEX_FEMALE } from '../../../constants/constants';

const FORM_OPTIONS = (data)=> {
  let ret = [
    {key:'NID', label:'货号', validators:[{key:'required', validator:Validators.required}]},
    {key:'o_name', label:'护理项目', validators:[{key:'required', validator:Validators.required},]},
    {key:'price', label:'价格', formatValue:(value)=>Utils.stringToInt(value), validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^(-?\d+)(\.\d+)?$/)}]},
];
  return ret;
}
@Component({
  selector: 'page-order-create-ornament',
  templateUrl: 'ornament.html'
})
export class OrderOrnamentPage implements OnInit {
  headerData: HeaderData = {title:'护理订单', menuEnable:false, type:'cart-list'};
  baseDatas: any = {};
  orderGroup: FormGroup;
  formOptions: Array<any>;
  orderType: string = constants.E_ORDER_TYPE.ORNAMENT;
  customerData: any;
  pics: Array<any> = [];
  urgentSource: Array<any> = [];
  urgent: string = '';
  currentUrgentData: any = null;
  order_remark: string = '';
  goodsOrnamentList:Array<any>=[];
  cartInfo:any = {cart:false};
  goods:any = null;

  UPLOAD_URL = constants.API_UPLOAD_SERVER_ADDRESS;
  FILE_URL = constants.API_FILE_SERVER_ADDRESS;

  @ViewChild(OrderCustomerEditComponent) customerControl: OrderCustomerEditComponent

  constructor(
    public navCtrl: NavController,
    private events: Events,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private customerProvider: CustomerProvider,
    private commonProvider: CommonProvider,
    private transfer: FileTransfer,
    private file: File,
    private imagePicker: ImagePicker,
    private cartProvider: CartProvider,
    public navParams: NavParams,
  ) {
    this.goods = navParams.get('goods');
    this.customerData = navParams.get('customer');
    this.cartInfo = navParams.get('cartInfo')||{cart:false};
  }

  ngOnInit(): void {
    this.formOptions = FORM_OPTIONS(this);
    this.orderGroup = this.formBuilder.group(FormValidator.getFormBuildGroupOptions(this.formOptions));
  }

  ionViewDidLoad(): void {
    this.commonProvider.getGoodsBaseDatas().then((data:any) => {
      if (data) {
        this.baseDatas = {};
        for(let key in data) {
          this.baseDatas[key] = data[key].list&&data[key].list.map((item)=>{
            return {value:item._id, label:item.name, ...item};
          });
        }
        if (data.urgentList) {
          this.urgentSource = data.urgentList.list;
          this.baseDatas.urgentList = data.urgentList.list.map((item)=>{
            return {value:item._id, label:item.day+'天', ...item};
          });
          this.baseDatas.urgentList.unshift({value:'0', label:'无', name:'', _id:''});
        }
        this.commonProvider.getGoodsList('goodsOrnamentList:goodsList', this.orderType).then((data:any) => {
          if (data && data.goodsOrnamentList) {
            this.goodsOrnamentList = data.goodsOrnamentList.list.map((item)=>{
              return {value:item._id, label:item.name, ...item};
            });
            this.initWithParams();
          }
        })
      }
    })
  }

  initWithParams = () => {
    if (this.goods && this.customerData) {
      this.customerControl.setCustomer(this.customerData);
      this.pics = this.goods.pics;
      this.urgent = this.goods.urgent && this.goods.urgent._id || '';
      this.currentUrgentData = this.urgentSource.find(item=>item._id === this.urgent);
      this.order_remark = this.goods.remark;

      let values = this.orderGroup.value;
      for(let key in values) {
        if (this.goods[key] !== undefined) {
          let v = this.goods[key];
          if (key === 'NID') {
            let goo = this.getValueFromListById(this.goodsOrnamentList, "", item => item.NID === v);
            values[key] = goo&&goo._id || '';
          } else if (v._id !== undefined) {
            values[key] = v._id;
          } else {
            values[key] = v;
          }
        }
      }
      this.orderGroup.setValue(values);
    }
  }

  onCustomerChange = (data: any): void => {
    let changed = data.phone !== (this.customerData&&this.customerData.phone||'');
    this.customerData = data;
    if (data._id && changed) {
    }
  }

  onUrgentChange = (): void => {
    this.currentUrgentData = this.urgentSource.find(item=>item._id === this.urgent);
  }

  onNIDChange = (): void => {
    let customer = this.customerControl.submit();
    if (!customer) return;

    let goodsInfo = this.getGoodsInfo();

    let nid = goodsInfo.NID;
    let goods = this.getValueFromListById(this.goodsOrnamentList, '', (item)=>item.NID === nid);
    if (goods) {
      this.orderGroup.controls.o_name.setValue(goods.name);
      this.orderGroup.controls.price.setValue(goods.price);
    } else {
      this.orderGroup.controls.o_name.setValue('');
      this.orderGroup.controls.price.setValue('');
    }
  }

  onPropertyChange = (): void => {
  }

  btnPicAddClicked(): void {
    this.pics.push({file:'', desc:''});
  }

  onPicDescChange(pic:any, desc: string): void {
    pic.desc = desc;
  }

  onBtnPickerClicked(pic: any) {
    this.imagePicker.getPictures({}).then((results) => {
      for (var i = 0; i < results.length; i++) {
          console.log('Image URI: ' + results[i]);
          // let filePath = '/Users/wanglingling/play.png';
          let filePath = results[i];
          const fileTransfer: FileTransferObject = this.transfer.create();
          let header = {
            'auth':API.auth
          }
          // Upload a file:
          fileTransfer.upload(filePath, this.UPLOAD_URL, {mimeType:'image/*', fileKey:'order', headers:header}).then((result: any)=>{
            console.log(result);
            if (pic && result.response) {
              let data = JSON.parse(result.response);
              if (data.data.files && data.data.files.length > 0) {
                pic.file = data.data.files[0];
              }
            }
          }).catch((error) => {
            console.log(error);
          });
      }
    }, (err) => { });
  }

  formatFormValue(values: any, options: Array<any>) {
    for(let op of options) {
      if (op.formatValue && values[op.key] !== undefined) {
        values[op.key] = op.formatValue(values[op.key]);
      }
    }
    return values;
  }

  getGoodsInfo() {
    let goodsInfo = {...this.orderGroup.value};
    this.formatFormValue(goodsInfo, this.formOptions);
    let mt = this.getValueFromListById(this.goodsOrnamentList, goodsInfo.NID);
    goodsInfo.NID = mt && mt.NID || '';
    return goodsInfo;
  }

  getSubOrderInfo = (): any => {
    if (!this.customerControl.customerGroup.valid) return null;

    let customer = this.customerData;
    if (this.orderGroup.valid) {
      let goodsInfo = this.getGoodsInfo();
      if (this.currentUrgentData) {
        goodsInfo.urgent = this.getValueFromListById([this.currentUrgentData], this.currentUrgentData._id);
      }
      if (this.pics) {
        let pics = this.pics.filter((item)=>{
          return item.file;
        })
        goodsInfo.pics = pics;
      }

      goodsInfo.type = this.orderType;
      goodsInfo.remark = this.order_remark;

      return { customer:customer, goods: goodsInfo };
    } else {
      let message = FormValidator.getValidError(this.orderGroup.controls, this.formOptions);
      if (message) {
        this.toastCtrl.create({
          message:message,
          duration:1500,
          position:'middle'
        }).present();
      }
    }

    return null;
  }

  createOrderClicked = ():void => {
    let result = this.getSubOrderInfo();
    if (result) {
      this.events.publish('order:pay', result.customer, [result.goods]);
      // this.cartProvider.addGoods(result.customer, result.goods);
    }
  }

  btnSureClicked = (): void => {
    if (this.cartInfo.cart) {
      let result = this.getSubOrderInfo();
      if (result) {
        this.events.publish('cart:update-goods', this.cartInfo.customerIndex, result.customer, this.cartInfo.goodsIndex, result.goods);
        this.navCtrl.pop();
      }
    }
  }

  addToCartClicked = ():void => {
    let result = this.getSubOrderInfo();
    if (result) {
      this.cartProvider.addGoods(result.customer, result.goods);
      this.navCtrl.pop();
    }
  }

  getValueFromListById(list: Array<any>, id: string, checkFn?: any): any {
    if (!list) return null;
    let ret = null;
    for(let item of list) {
      if (checkFn) {
        if (checkFn(item)) {
          ret = item;
          break;
        }
      } else {
        if (item._id === id) {
          ret = item;
          break;
        }
      }
    }
    return this.filterEditorProperty(ret);
  }
  getValueFromListByName(list: Array<any>, name: string, checkFn?: any): any {
    if (!list) return null;
    if (!name) return {_id:'', NID:'', name:''};
    name = name.trim();

    let ret = null;
    for(let item of list) {
      if (checkFn) {
        if (checkFn(item)) {
          ret = item;
          break;
        }
      } else {
        if (item.name && item.name.trim() === name) {
          ret = item;
          break;
        }
      }
    }
    if (ret) {
      return this.filterEditorProperty(ret);
    } else {
      return {_id:'', NID:'', name:name};
    }
  }

  filterEditorProperty(value: any): any {
    if (value) {
      let ret = {};
      for(let key in value) {
        if (key.indexOf('editor_') === -1 && key !== 'label' && key !== 'value') {
          ret[key] = value[key];
        }
      }
      return ret;
    }

    return null;
  }
}
