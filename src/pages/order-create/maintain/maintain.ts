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
import { shoesTieBianType } from '../../../api/graphqlTypes';

const FORM_OPTIONS = (data)=> {
  let ret = [
    {key:'NID', label:'货号', validators:[{key:'required', validator:Validators.required}]},
    {key:'m_name', label:'护理项目', validators:[{key:'required', validator:Validators.required},]},
    {key:'m_time', label:'时间', validators:[{key:'required', validator:Validators.required},]},
    {key:'m_wash', label:'是否水洗', validators:[{key:'required', validator:Validators.required},]},
    {key:'m_color', label:'颜色', validators:[{key:'required', validator:Validators.required},]},
    {key:'m_demo', label:'色卡编号', formatValue:(value)=>Utils.stringToInt(value), validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^(-?\d+)(\.\d+)?$/)}]},
    {key:'m_price', label:'价格', formatValue:(value)=>Utils.stringToInt(value), validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^(-?\d+)(\.\d+)?$/)}]},
];
  return ret;
}
@Component({
  selector: 'page-order-create-maintain',
  templateUrl: 'maintain.html'
})
export class OrderMaintainPage implements OnInit {
  headerData: HeaderData = {title:'订单创建', menuEnable:false, type:'cart-list'};
  baseDatas: any = {};
  orderGroup: FormGroup;
  formOptions: Array<any>;
  orderType: string = constants.E_ORDER_TYPE.MAINTAIN;
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
    }
  }

  onUrgentChange = (): void => {
    this.currentUrgentData = this.urgentSource.find(item=>item._id === this.urgent);
  }

  onNIDChange = (): void => {
    let customer = this.customerControl.submit();
    if (!customer) return;

    let goodsInfo = this.getGoodsInfo();

    let nid = goodsInfo;
    if (nid !== constants.NULL_NID) {
      let goods = this.getValueFromListById(this.baseDatas.maintainList, '', (item)=>item.NID === nid);
      if (goods) {
        this.orderGroup.controls.m_name.setValue(goods.m_name);
        this.orderGroup.controls.m_time.setValue(goods.m_time);
        this.orderGroup.controls.m_price.setValue(goods.m_price);
      } else {
        this.orderGroup.controls.m_name.setValue('');
        this.orderGroup.controls.m_time.setValue('');
        this.orderGroup.controls.m_price.setValue('');
      }
    } else {
      this.orderGroup.controls.m_name.setValue('');
      this.orderGroup.controls.m_time.setValue('');
      this.orderGroup.controls.m_price.setValue('');
    }
    this.orderGroup.controls.NID.setValue(nid);
  }

  onPropertyChange = (): void => {
    let customer = this.customerControl.submit();
    if (!customer) return;

    let goodsInfo = this.getGoodsInfo();

    let nid = commonUtils.createGoodsNID(this.orderType, goodsInfo, customer.sex);
    if (nid !== constants.NULL_NID) {
      let shoes = this.getValueFromListById(this.baseDatas.goodsShoesList, '', (item)=>item.NID === nid);
      if (shoes) {
        this.orderGroup.controls.price.setValue(shoes.price);
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

    goodsInfo.price = goodsInfo.m_price;
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

      goodsInfo.type = constants.E_ORDER_TYPE.MAINTAIN;

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
