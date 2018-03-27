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

import { ShopPage } from '../../shop/shop'
import { HomePage } from '../../home/home'

const FORM_OPTIONS = (data)=> {
  let ret = [
    {key:'NID', label:'货号', validators:[{key:'required', validator:Validators.required}]},
    {key:'b_material', label:'材质', validators:[{key:'required', validator:Validators.required},]},
    {key:'b_color', label:'颜色', validators:[{key:'required', validator:Validators.required},]},
    {key:'sex', label:'性别', validators:[{key:'required', validator:Validators.required}]},
    {key:'price', label:'价格', formatValue:(value)=>Utils.stringToInt(value), validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^(-?\d+)(\.\d+)?$/)}]},
  ];
  return ret;
}

const FORM_SIZE_OPTIONS = (data)=> [
  {key:'b_A', label:'A', formatValue:(value)=>Utils.stringToInt(value), validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^(-?\d+)(\.\d+)?$/)}]},
  {key:'b_B', label:'B', formatValue:(value)=>Utils.stringToInt(value), validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^(-?\d+)(\.\d+)?$/)}]},
  {key:'b_C', label:'C', formatValue:(value)=>Utils.stringToInt(value), validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^(-?\d+)(\.\d+)?$/)}]},
  {key:'b_D', label:'D', formatValue:(value)=>Utils.stringToInt(value), validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^(-?\d+)(\.\d+)?$/)}]},
]

@Component({
  selector: 'page-order-create-belt',
  templateUrl: 'belt.html'
})
export class OrderBeltPage implements OnInit {
  headerData: HeaderData = {title:'皮带订单', menuEnable:false, type:'cart-list'};
  baseDatas: any = {};
  orderGroup: FormGroup;
  sizeGroup: FormGroup;
  formOptions: Array<any>;
  formSizeOptions: Array<any>;
  orderType: string = constants.E_ORDER_TYPE.BELT;
  customerData: any;
  pics: Array<any> = [];
  urgentSource: Array<any> = [];
  urgent: string = '';
  currentUrgentData: any = null;
  order_remark: string = '';
  goodsList: Array<any> = [];
  cartInfo:any = {cart:false};
  goods:any = null;
  viewProfile: boolean = false;
  sexDataList: Array<any> = [{label:'男', value:'男'}, {label:'女', value:'女'}];
  goodsIcon: string = '';

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
    this.viewProfile = navParams.get('viewProfile');
  }

  ngOnInit(): void {
    this.formOptions = FORM_OPTIONS(this);
    this.orderGroup = this.formBuilder.group(FormValidator.getFormBuildGroupOptions(this.formOptions));
    this.formSizeOptions = FORM_SIZE_OPTIONS(this);
    this.sizeGroup = this.formBuilder.group(FormValidator.getFormBuildGroupOptions(this.formSizeOptions));
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

        this.initWithParams();
      }
    })
    this.commonProvider.getGoodsList('goodsList', this.orderType).then((data:any) => {
      if (data && data.goodsList) {
        this.goodsList = data.goodsList.list.map((item)=>{
          return {value:item.NID, label:item.name, ...item};
        });;
      }
    })
  }

  isEditing = () => {
    return !this.viewProfile;
  }

  initWithParams = () => {
    if (this.goods && this.customerData) {
      this.customerControl.setCustomer(this.customerData);
      this.customerControl.setViewProfile(this.viewProfile);
      this.pics = this.goods.pics;

      if (this.isEditing()) {
        this.urgent = this.goods.urgent && this.goods.urgent._id || '';
        this.currentUrgentData = this.urgentSource.find(item=>item._id === this.urgent);
      } else {
        this.urgent = this.goods.urgent && this.goods.urgent.day || '';
        this.currentUrgentData = this.urgentSource.find(item=>item.day === this.urgent);
        if (this.urgent) {
          this.urgent = this.urgent + '天';
        }
      }
      this.order_remark = this.goods.remark;

      let values = this.orderGroup.value;
      for(let key in values) {
        if (this.goods[key] !== undefined) {
          let v = this.goods[key];
          if (v._id !== undefined) {
            values[key] = this.isEditing() ? v._id : v.name;
          } else {
            values[key] = v;
          }
        }
      }
      this.orderGroup.setValue(values);

      values = this.sizeGroup.value;
      for(let key in values) {
        if (this.goods[key] !== undefined) {
          let v = this.goods[key];
          if (v._id !== undefined) {
            values[key] = v._id;
          } else {
            values[key] = v;
          }
        }
      }
      this.sizeGroup.setValue(values);
    }
  }

  onCustomerChange = (data: any): void => {
    let changed = data.phone !== (this.customerData&&this.customerData.phone||'');
    this.customerData = data;
    if (data._id && changed) {
      this.customerProvider.getCustomerLastSubOrder('lastSubOrderInfo', this.orderType, data._id).then((result) => {
        if (result && result.code === 0) {
          let values: any = {};
          let info = result.data.lastSubOrderInfo;

          let keys = ['b_A', 'b_B', 'b_C', 'b_D'];
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
      if (!this.orderGroup.value.sex) {
        this.orderGroup.controls.sex.setValue(data.sex);
      }
    }
  }

  onUrgentChange = (): void => {
    this.currentUrgentData = this.urgentSource.find(item=>item._id === this.urgent);
  }

  onNIDChange = (): void => {
    let values: any = {...this.orderGroup.value};
    values.b_material = '';
    values.b_color = '';
    let NID = this.orderGroup.controls.NID.value;
    for(let goods of this.goodsList) {
      if (goods.NID === NID) {
        values.b_material = goods.b_material._id;
        values.b_color = goods.b_color._id;
        values.price = goods.price;
        values.sex = goods.sex;
        this.goodsIcon = goods.pics&&goods.pics.length>0&&goods.pics[0];
        break;
      }
    }
    this.orderGroup.setValue(values);
  }

  getGoodsByCurrentInput = (goodsInputInfo) => {
    if (goodsInputInfo.b_material && goodsInputInfo.sex && goodsInputInfo.b_color) {
      for(let goods of this.goodsList) {
        if (goods.b_material && goods.b_color && goods.sex) {
          if (goods.b_material._id === goodsInputInfo.b_material._id
            && goods.b_color._id === goodsInputInfo.b_color._id
            && goods.sex === goodsInputInfo.sex
          ) {
            return goods;
          }
        }
      }
    }
    return null;
  }

  onPropertyChange = (): void => {
    let customer = this.customerControl.submit();
    if (!customer) return;

    let goodsInfo = this.getGoodsInfo();
    let goods = this.getGoodsByCurrentInput(goodsInfo);
    if (goods) {
      this.goodsIcon = goods.pics&&goods.pics.length>0&&goods.pics[0];
      this.orderGroup.controls.NID.setValue(goods.NID);
      this.orderGroup.controls.price.setValue(goods.price);
    } else {
      this.orderGroup.controls.NID.setValue(constants.NULL_NID);
      this.orderGroup.controls.price.setValue(null);
      this.goodsIcon = '';
    }
  }

  btnPicAddClicked(): void {
    if (!this.isEditing()) return;
    this.pics.push({file:'', desc:''});
  }

  onPicDescChange(pic:any, desc: string): void {
    pic.desc = desc;
  }

  onBtnPickerClicked(pic: any) {
    if (!this.isEditing()) return;
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

    goodsInfo.b_material = this.getValueFromListById(this.baseDatas.materialList, goodsInfo.b_material);
    goodsInfo.b_color = this.getValueFromListById(this.baseDatas.materialColorList, goodsInfo.b_color);
    return goodsInfo;
  }

  getSubOrderInfo = (): any => {
    if (!this.customerControl.customerGroup.valid) return null;

    let customer = this.customerData;
    if (this.sizeGroup.valid && this.orderGroup.valid) {
      let goodsInfo = this.getGoodsInfo();
      goodsInfo = Object.assign(goodsInfo, this.sizeGroup.value);
      this.formatFormValue(goodsInfo, this.formSizeOptions);

      if (goodsInfo.b_material) {
        goodsInfo.b_material = {...goodsInfo.b_material};
        goodsInfo.b_material.count = null;
        if (goodsInfo.b_material.color) {
          goodsInfo.b_material.color = goodsInfo.b_material.color.name;
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

      goodsInfo.type = this.orderType;
      goodsInfo.remark = this.order_remark;
      goodsInfo.icon = this.goodsIcon;

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
    if (!this.isEditing()) return;
    let result = this.getSubOrderInfo();
    if (result) {
      this.events.publish('order:pay', result.customer, [result.goods]);
      // this.cartProvider.addGoods(result.customer, result.goods);
    }
  }

  btnSureClicked = (): void => {
    if (!this.isEditing()) return;
    if (this.cartInfo.cart) {
      let result = this.getSubOrderInfo();
      if (result) {
        this.events.publish('cart:update-goods', this.cartInfo.customerIndex, result.customer, this.cartInfo.goodsIndex, result.goods);
        this.navCtrl.pop();
      }
    }
  }

  addToCartClicked = ():void => {
    if (!this.isEditing()) return;
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
