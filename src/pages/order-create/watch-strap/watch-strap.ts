import { Component, Input, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { NavController, ToastController, Events } from 'ionic-angular';
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

const FEMALE_OPTIONS = [
  {key:'s_gen_gao', label:'跟高', validators:[{key:'required', validator:Validators.required}]}
]

const FORM_OPTIONS = (data)=> {
  let ret = [
    {key:'NID', label:'货号', validators:[{key:'required', validator:Validators.required}]},
    {key:'ws_material', label:'材质', validators:[{key:'required', validator:Validators.required},]},
    {key:'ws_style', label:'款式', validators:[{key:'required', validator:Validators.required},]},
    {key:'price', label:'价格', formatValue:(value)=>Utils.stringToInt(value), validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^(-?\d+)(\.\d+)?$/)}]},
  ];
  return ret;
}
const FORM_SIZE_OPTIONS = (data)=> [
  {key:'ws_A', label:'A', formatValue:(value)=>Utils.stringToInt(value), validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^(-?\d+)(\.\d+)?$/)}]},
  {key:'ws_B', label:'B', formatValue:(value)=>Utils.stringToInt(value), validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^(-?\d+)(\.\d+)?$/)}]},
  {key:'ws_C', label:'C', formatValue:(value)=>Utils.stringToInt(value), validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^(-?\d+)(\.\d+)?$/)}]},
  {key:'ws_D', label:'D', formatValue:(value)=>Utils.stringToInt(value), validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^(-?\d+)(\.\d+)?$/)}]},
  {key:'ws_E', label:'E', formatValue:(value)=>Utils.stringToInt(value), validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^(-?\d+)(\.\d+)?$/)}]},
  {key:'ws_F', label:'F', formatValue:(value)=>Utils.stringToInt(value), validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^(-?\d+)(\.\d+)?$/)}]},
  {key:'ws_G', label:'G', formatValue:(value)=>Utils.stringToInt(value), validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^(-?\d+)(\.\d+)?$/)}]},
  {key:'ws_watch_brand', label:'品牌', validators:[]},
]

@Component({
  selector: 'page-order-create-watch-strap',
  templateUrl: 'watch-strap.html'
})
export class OrderWatchStrapPage implements OnInit {
  headerData: HeaderData = {title:'订单创建', menuEnable:false, type:'cart-list'};
  baseDatas: any = {};
  orderGroup: FormGroup;
  sizeGroup: FormGroup;
  formOptions: Array<any>;
  formSizeOptions: Array<any>;
  orderType: string = constants.E_ORDER_TYPE.WATCH_STRAP;
  customerData: any;
  pics: Array<any> = [];
  urgentSource: Array<any> = [];
  urgent: string = '';
  currentUrgentData: any = null;
  order_remark: string = '';

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
    private cartProvider: CartProvider
  ) {
  }

  ngOnInit(): void {
    this.formOptions = FORM_OPTIONS(this);
    this.orderGroup = this.formBuilder.group(FormValidator.getFormBuildGroupOptions(this.formOptions));
    this.formSizeOptions = FORM_SIZE_OPTIONS(this);
    this.sizeGroup = this.formBuilder.group(FormValidator.getFormBuildGroupOptions(this.formSizeOptions));
  }

  ionViewDidEnter(): void {
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
      }
    })
  }

  onCustomerChange = (data: any): void => {
    let changed = data.phone !== (this.customerData&&this.customerData.phone||'');
    this.customerData = data;
    if (data._id && changed) {
      this.customerProvider.getCustomerLastSubOrder('lastSubOrderInfo', constants.E_ORDER_TYPE.WATCH_STRAP, data._id).then((result) => {
        if (result && result.code === 0) {
          let values: any = {};
          let info = result.data.lastSubOrderInfo;

          let keys = ['ws_A', 'ws_B', 'ws_C', 'ws_D', 'ws_E', 'ws_F', 'ws_G', 'ws_watch_brand'];
          if (info) {
            keys.forEach((key) => {
              if (info[key] !== null && info[key] !== undefined) {
                values[key] = info[key];
              }
            })
            this.sizeGroup.setValue(values);
          }
        }
      })
    }
  }

  onUrgentChange = (): void => {
    this.currentUrgentData = this.urgentSource.find(item=>item._id === this.urgent);
  }

  onPropertyChange = (): void => {
    let customer = this.customerControl.submit();
    if (!customer) return;

    let goodsInfo = this.getGoodsInfo();

    let nid = commonUtils.createGoodsNID(this.orderType, goodsInfo, customer.sex);
    if (nid !== constants.NULL_NID) {
      let goods = this.getValueFromListById(this.baseDatas.goodsWatchStrapList, '', (item)=>item.NID === nid);
      if (goods) {
        this.orderGroup.controls.price.setValue(goods.price);
      } else {
        this.orderGroup.controls.price.setValue(null);
      }
    } else {
      this.orderGroup.controls.price.setValue(null);
    }
    this.orderGroup.controls.NID.setValue(nid);
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

    goodsInfo.ws_material = this.getValueFromListById(this.baseDatas.materialList, goodsInfo.ws_material);
    goodsInfo.ws_style = this.getValueFromListById(this.baseDatas.watchStrapStyleList, goodsInfo.ws_style);
    return goodsInfo;
  }

  getSubOrderInfo = (): any => {
    if (!this.customerControl.customerGroup.valid) return null;

    let customer = this.customerData;
    if (this.sizeGroup.valid && this.orderGroup.valid) {
      let goodsInfo = this.getGoodsInfo();
      goodsInfo = Object.assign(goodsInfo, this.sizeGroup.value);
      this.formatFormValue(goodsInfo, this.formSizeOptions);

      if (goodsInfo.ws_material) {
        goodsInfo.ws_material = {...goodsInfo.ws_material};
        goodsInfo.ws_material.count = null;
        if (goodsInfo.ws_material.color) {
          goodsInfo.ws_material.color = goodsInfo.ws_material.color.name;
        }
      }
      if (this.currentUrgentData) {
        goodsInfo.urgent = this.getValueFromListById([this.currentUrgentData], this.currentUrgentData._id);
      }
      if (this.pics) {
        let pics = this.pics.filter((item)=>{
          return item.file;
        })
        goodsInfo.pics = pics;
      }

      goodsInfo.type = constants.E_ORDER_TYPE.WATCH_STRAP;

      return { customer:customer, goods: goodsInfo };
    } else {
      let message = FormValidator.getValidError(this.sizeGroup.controls, this.formSizeOptions);
      if (!message) {
        message = FormValidator.getValidError(this.orderGroup.controls, this.formOptions);
      }
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

  addToCartClicked = ():void => {
    let result = this.getSubOrderInfo();
    if (result) {
      this.cartProvider.addGoods(result.customer, result.goods);
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
