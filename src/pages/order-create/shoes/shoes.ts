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
import { shoesTieBianType } from '../../../api/graphqlTypes';

const FEMALE_OPTIONS = [
  {key:'s_gen_gao', label:'跟高', validators:[{key:'required', validator:Validators.required}]}
]

const FORM_OPTIONS = (data)=> {
  let ret = [
    {key:'NID', label:'货号', validators:[{key:'required', validator:Validators.required}]},
    {key:'s_gui_ge', label:'规格', validators:[{key:'required', validator:Validators.required},]},
    {key:'s_xuan_hao', label:'楦号', validators:[{key:'required', validator:Validators.required},]},
    {key:'s_material', label:'材质', validators:[{key:'required', validator:Validators.required},]},
    {key:'s_out_color', label:'颜色', validators:[{key:'required', validator:Validators.required},]},
    {key:'s_in_color', label:'内里色', validators:[{key:'required', validator:Validators.required},]},
    {key:'s_bottom_color', label:'底板色', validators:[{key:'required', validator:Validators.required},]},
    {key:'s_bottom_side_color', label:'底侧色', validators:[{key:'required', validator:Validators.required}]},
    {key:'s_tie_di', label:'贴底', validators:[{key:'required', validator:Validators.required}]},
    {key:'price', label:'价格', formatValue:(value)=>Utils.stringToInt(value), validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^(-?\d+)(\.\d+)?$/)}]},
    {key:'s_gen_gao', label:'跟高', defaultValue:'0', validators:[{key:'required', validator:Validators.required}]}
  ];
  return ret;
}
const FORM_FOOTER_OPTIONS = (data)=> [
  {key:'s_foot_size', label:'跟高', formatValue:(value)=>Utils.stringToInt(value), validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^(-?\d+)(\.\d+)?$/)}]},
  {key:'s_left_length', label:'左脚长度', formatValue:(value)=>Utils.stringToInt(value), validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^(-?\d+)(\.\d+)?$/)}]},
  {key:'s_left_zhiWei', label:'左脚趾围', formatValue:(value)=>Utils.stringToInt(value), validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^(-?\d+)(\.\d+)?$/)}]},
  {key:'s_left_fuWei', label:'左脚附维', formatValue:(value)=>Utils.stringToInt(value), validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^(-?\d+)(\.\d+)?$/)}]},
  {key:'s_right_length', label:'右脚长度', formatValue:(value)=>Utils.stringToInt(value), validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^(-?\d+)(\.\d+)?$/)}]},
  {key:'s_right_zhiWei', label:'右脚趾围', formatValue:(value)=>Utils.stringToInt(value), validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^(-?\d+)(\.\d+)?$/)}]},
  {key:'s_right_fuWei', label:'右脚附维', formatValue:(value)=>Utils.stringToInt(value), validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^(-?\d+)(\.\d+)?$/)}]}
]

@Component({
  selector: 'page-order-create-shoes',
  templateUrl: 'shoes.html'
})
export class OrderShoesPage implements OnInit {
  headerData: HeaderData = {title:'鞋订单', menuEnable:false, type:'cart-list'};
  baseDatas: any = {};
  orderGroup: FormGroup;
  footerGroup: FormGroup;
  formOptions: Array<any>;
  formFooterOptions: Array<any>;
  orderType: string = constants.E_ORDER_TYPE.SHOES;
  customerData: any = null;
  pics: Array<any> = [];
  customs: Array<any> = [];
  customPrice: number = 0;
  urgentSource: Array<any> = [];
  urgent: string = '';
  currentUrgentData: any = null;
  order_remark: string = '';
  goodsList: Array<any> = [];
  goods:any = null;
  cartInfo:any = {cart:false}
  viewProfile: boolean = false;

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
    this.formFooterOptions = FORM_FOOTER_OPTIONS(this);
    this.footerGroup = this.formBuilder.group(FormValidator.getFormBuildGroupOptions(this.formFooterOptions));
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

        if (data.customList) {
          this.customs = data.customList.list.map((item) => {
            item.selected = false;
            return item;
          })
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
    this.commonProvider.getGoodsList('goodsList', constants.E_ORDER_TYPE.SHOES).then((data:any) => {
      if (data && data.goodsList) {
        this.goodsList = data.goodsList.list.map((item)=>{
          return {value:item.NID, label:item.name, ...item};
        });;
      }
    })

  }

  initWithParams = () => {
    if (this.goods && this.customerData) {
      this.customerControl.setCustomer(this.customerData);
      this.customerControl.setViewProfile(this.viewProfile);
      this.pics = this.goods.pics;
      this.customPrice = 0;
      this.customs = this.customs.map((item)=>{
        item.selected = false;
        if (this.goods.s_customs) {
          for(let cu of this.goods.s_customs) {
            if (cu._id === item._id) {
              item.selected = true;
              this.customPrice += cu.price;
              break;
            }
          }
        }
        return item;
      });
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
        if (this.goods[key] !== undefined && this.goods[key] !== null) {
          let v = this.goods[key];
          if (v._id !== undefined) {
            values[key] = this.isEditing() ? v._id : v.name;
          } else {
            values[key] = v;
          }
        }
      }
      this.orderGroup.setValue(values);

      values = this.footerGroup.value;
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
      this.footerGroup.setValue(values);
    }
  }

  onCustomerChange = (data: any): void => {
    if (!this.isEditing()) return;
    let changed = data && data.phone !== (this.customerData&&this.customerData.phone||'');
    this.customerData = data;
    if (data && data._id && changed) {
      this.customerProvider.getCustomerLastSubOrder('lastSubOrderInfo', constants.E_ORDER_TYPE.SHOES, data._id).then((result) => {
        if (result && result.code === 0) {
          let values: any = {};
          let info = result.data.lastSubOrderInfo;

          let keys = ['s_foot_size', 's_left_length', 's_left_zhiWei', 's_left_fuWei', 's_right_length', 's_right_zhiWei', 's_right_fuWei'];
          if (info) {
            keys.forEach((key) => {
              if (info[key] !== null && info[key] !== undefined) {
                values[key] = info[key];
              }
            })
            this.footerGroup.setValue(values);
          }
        }
      })
    }
  }

  onCustomClicked(data: any): void {
    if (!this.isEditing()) return;
    data.selected = !data.selected;

    this.customPrice = 0;
    for(let cu of this.customs) {
      if (cu.selected) {
        this.customPrice += cu.price;
      }
    }
  }

  // 是否女性
  isFemale = () => {
    return this.customerData && this.customerData.sex === constants.SEX_FEMALE;
  }

  onUrgentChange = (): void => {
    this.currentUrgentData = this.urgentSource.find(item=>item._id === this.urgent);
  }

  onNIDChange = (): void => {
    let values: any = {...this.orderGroup.value};
    values.s_material = '';
    values.s_xuan_hao = '';
    values.s_gui_ge = '';
    values.s_out_color = '';
    values.s_in_color = '';
    values.s_bottom_color = '';
    values.s_bottom_side_color = '';
    values.s_gen_gao = '0';
    let NID = this.orderGroup.controls.NID.value;

    for(let goods of this.goodsList) {
      if (goods.NID === NID) {
        values.s_material = goods.s_material._id;
        values.s_xuan_hao = goods.s_xuan_hao._id;
        values.s_gui_ge = goods.s_gui_ge._id;
        values.s_out_color = goods.s_out_color._id;
        values.s_in_color = goods.s_in_color._id;
        values.s_bottom_color = goods.s_bottom_color._id;
        values.s_bottom_side_color = goods.s_bottom_side_color._id;
        values.s_gen_gao = goods.s_gen_gao && goods.s_gen_gao._id || '0';
        values.price = goods.price;
        break;;
      }
    }
    this.orderGroup.setValue(values);
  }

  onPropertyChange = (): void => {
    let customer = this.customerControl.submit();
    if (!customer) return;

    let shoesInfo = this.getShoesInfo();

    let nid = commonUtils.createGoodsNID(this.orderType, shoesInfo, customer.sex);
    if (nid !== constants.NULL_NID) {
      let shoes = this.getValueFromListById(this.goodsList, '', (item)=>item.NID === nid);
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
    if (this.isEditing()) {
      this.pics.push({file:'', desc:''});
    }
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
    // // console.log(pic);

    // let filePath = '/Users/wanglingling/play.png';
    // const fileTransfer: FileTransferObject = this.transfer.create();

    // // Upload a file:
    // fileTransfer.upload(filePath, encodeURI(this.UPLOAD_URL), {mimeType:'image/*'}).then((data)=>{
    //   console.log(data);
    // }).catch((error) => {
    //   console.log(error);
    // });
  }

  formatFormValue(values: any, options: Array<any>) {
    for(let op of options) {
      if (op.formatValue && values[op.key] !== undefined) {
        values[op.key] = op.formatValue(values[op.key]);
      }
    }
    return values;
  }

  getShoesInfo() {
    let shoesInfo = {...this.orderGroup.value};
    this.formatFormValue(shoesInfo, this.formOptions);

    shoesInfo.s_material = this.getValueFromListById(this.baseDatas.materialList, shoesInfo.s_material);
    shoesInfo.s_xuan_hao = this.getValueFromListById(this.baseDatas.xuanHaoList, shoesInfo.s_xuan_hao);
    shoesInfo.s_gui_ge = this.getValueFromListById(this.baseDatas.guiGeList, shoesInfo.s_gui_ge);
    shoesInfo.s_out_color = this.getValueFromListById(this.baseDatas.outColorList, shoesInfo.s_out_color);
    shoesInfo.s_in_color = this.getValueFromListById(this.baseDatas.inColorList, shoesInfo.s_in_color);
    shoesInfo.s_bottom_color = this.getValueFromListById(this.baseDatas.bottomColorList, shoesInfo.s_bottom_color);
    shoesInfo.s_bottom_side_color = this.getValueFromListById(this.baseDatas.bottomSideColorList, shoesInfo.s_bottom_side_color);
    shoesInfo.s_tie_di = this.getValueFromListById(this.baseDatas.shoesTieBianList, shoesInfo.s_tie_di);
    shoesInfo.s_gen_gao = this.getValueFromListById(this.baseDatas.genGaoList, shoesInfo.s_gen_gao);
    return shoesInfo;
  }

  getSubOrderInfo = (): any => {
    if (!this.customerControl.customerGroup.valid) return null;

    let customer = this.customerData;
    if (this.footerGroup.valid && this.orderGroup.valid) {
      let shoesInfo = this.getShoesInfo();
      shoesInfo = Object.assign(shoesInfo, this.footerGroup.value);
      this.formatFormValue(shoesInfo, this.formFooterOptions);

      if (shoesInfo.s_material) {
        shoesInfo.s_material = {...shoesInfo.s_material};
        shoesInfo.s_material.count = null;
        if (shoesInfo.s_material.color) {
          shoesInfo.s_material.color = shoesInfo.s_material.color.name;
        }
      }
      shoesInfo.s_customs = this.customs.filter(item=>item.selected).map((item)=>{
        item.selected = null;
        return this.filterEditorProperty(item);
      });
      if (this.currentUrgentData) {
        shoesInfo.urgent = this.getValueFromListById([this.currentUrgentData], this.currentUrgentData._id);
      }
      if (this.pics) {
        let pics = this.pics.filter((item)=>{
          return item.file;
        })
        shoesInfo.pics = pics;
      }

      shoesInfo.type = constants.E_ORDER_TYPE.SHOES;
      shoesInfo.remark = this.order_remark;

      return { customer:customer, goods: shoesInfo };
    } else {
      let message = FormValidator.getValidError(this.footerGroup.controls, this.formFooterOptions);
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

  isEditing = () => {
    return !this.viewProfile;
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
