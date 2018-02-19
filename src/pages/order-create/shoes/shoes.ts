import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

import { CustomerData } from '../../../interface/customer-data'
import { FormValidator } from '../../../utils/form-validator'
import { CustomerProvider, CommonProvider } from '../../../providers'
import * as commonUtils from '../../../utils/common-utils'
import {HeaderData} from '../../../interface/header-data';
import { orderType } from '../../../api/orderTypes';
import * as constants from '../../../constants/constants'
import { OrderCustomerEditComponent } from '../customer-edit/customer-edit.component';
import { API_FILE_SERVER_ADDRESS } from '../../../constants/constants';

const FORM_OPTIONS = (data)=> [
  {key:'NID', label:'编号', validators:[{key:'required', validator:Validators.required}]},
  {key:'s_gui_ge', label:'规格', validators:[{key:'required', validator:Validators.required},]},
  {key:'s_xuan_hao', label:'楦号', validators:[{key:'required', validator:Validators.required},]},
  {key:'s_material', label:'材质', validators:[{key:'required', validator:Validators.required},]},
  {key:'s_out_color', label:'颜色', validators:[{key:'required', validator:Validators.required},]},
  {key:'s_in_color', label:'内里色', validators:[{key:'required', validator:Validators.required},]},
  {key:'s_bottom_color', label:'底板色', validators:[{key:'required', validator:Validators.required},]},
  {key:'s_bottom_side_color', label:'底侧色', validators:[{key:'required', validator:Validators.required}]},
  {key:'s_tie_di', label:'贴底', validators:[{key:'required', validator:Validators.required}]},
  {key:'s_gen_gao', label:'跟高', validators:[{key:'required', validator:Validators.required}]},

  {key:'price', label:'价格', validators:[{key:'required', validator:Validators.required}]},

]
const FORM_FOOTER_OPTIONS = (data)=> [
  {key:'s_foot_size', label:'跟高', validators:[{key:'required', validator:Validators.required}]},
  {key:'s_left_length', label:'左脚长度', validators:[{key:'required', validator:Validators.required}]},
  {key:'s_left_zhiWei', label:'左脚趾围', validators:[{key:'required', validator:Validators.required}]},
  {key:'s_left_fuWei', label:'左脚附维', validators:[{key:'required', validator:Validators.required}]},
  {key:'s_right_length', label:'右脚长度', validators:[{key:'required', validator:Validators.required}]},
  {key:'s_right_zhiWei', label:'右脚趾围', validators:[{key:'required', validator:Validators.required}]},
  {key:'s_right_fuWei', label:'右脚附维', validators:[{key:'required', validator:Validators.required}]}
]

@Component({
  selector: 'page-order-create-shoes',
  templateUrl: 'shoes.html'
})
export class OrderShoesPage implements OnInit {
  headerData: HeaderData = {title:'订单创建', menuEnable:false};
  baseDatas: any = {};
  orderGroup: FormGroup;
  footerGroup: FormGroup;
  formOptions: Array<any>;
  formFooterOptions: Array<any>;
  orderType: string = constants.E_ORDER_TYPE.SHOES;
  customerData: any;
  pics: Array<any> = [];
  customs: Array<any> = [];
  customPrice: number = 0;
  urgentSource: Array<any> = [];
  urgent: string = '';
  currentUrgentData: any = null; 

  UPLOAD_URL = constants.API_UPLOAD_SERVER_ADDRESS;
  FILE_URL = constants.API_FILE_SERVER_ADDRESS;

  @ViewChild(OrderCustomerEditComponent) customerControl: OrderCustomerEditComponent

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private customerProvider: CustomerProvider,
    private commonProvider: CommonProvider,
    private transfer: FileTransfer, 
    private file: File
  ) {
  }


  ngOnInit(): void {
    this.formOptions = FORM_OPTIONS(null);
    this.orderGroup = this.formBuilder.group(FormValidator.getFormBuildGroupOptions(this.formOptions));
    this.formFooterOptions = FORM_FOOTER_OPTIONS(null);
    this.footerGroup = this.formBuilder.group(FormValidator.getFormBuildGroupOptions(this.formFooterOptions));
  }

  ionViewDidEnter(): void {
    this.commonProvider.getGoodsBaseDatas().then((data:any) => {
      if (data) {
        this.baseDatas = {};
        for(let key in data) {
          this.baseDatas[key] = data[key].list&&data[key].list.map((item)=>{
            return {value:item._id, label:item.name, _id:item._id, NID:item.NID, name:item.name};
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
            return {value:item._id, label:item.day+'天', _id:item._id, NID:item.NID, name:item.name};
          });
          this.baseDatas.urgentList.unshift({value:'0', label:'无', name:'', _id:''});
        }
      }
    })
  }

  onCustomerChange = (data: any): void => {
    this.customerData = data;
  }
  onCustomClicked(data: any): void {
    data.selected = !data.selected;

    this.customPrice = 0;
    for(let cu of this.customs) {
      if (cu.selected) {
        this.customPrice += cu.price;
      }
    }
  }

  onUrgentChange = (): void => {
    this.currentUrgentData = this.urgentSource.find(item=>item._id === this.urgent);
  }

  onPropertyChange = (): void => {
    let customer = this.customerControl.submit();
    if (!customer) return;

    let shoesInfo = this.getShoesInfo();

    let nid = commonUtils.createGoodsNID(this.orderType, shoesInfo, customer.sex);
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
    // console.log(pic);
    let filePath = '/Users/wanglingling/play.png';
    const fileTransfer: FileTransferObject = this.transfer.create();

    // Upload a file:
    fileTransfer.upload(filePath, encodeURI(this.UPLOAD_URL), {mimeType:'image/*'}).then((data)=>{
      console.log(data);
    }).catch((error) => {
      console.log(error);
    });
  }

  getShoesInfo() {
    let shoesInfo = {...this.orderGroup.value};
    shoesInfo.s_material = this.getValueFromListById(this.baseDatas.materialList, shoesInfo.s_material);
    shoesInfo.s_xuan_hao = this.getValueFromListById(this.baseDatas.xuanHaoList, shoesInfo.s_xuan_hao);
    shoesInfo.s_gui_ge = this.getValueFromListById(this.baseDatas.guiGeList, shoesInfo.s_gui_ge);
    shoesInfo.s_out_color = this.getValueFromListById(this.baseDatas.outColorList, shoesInfo.s_out_color);
    shoesInfo.s_in_color = this.getValueFromListById(this.baseDatas.inColorList, shoesInfo.s_in_color);
    shoesInfo.s_bottom_color = this.getValueFromListById(this.baseDatas.bottomColorList, shoesInfo.s_bottom_color);
    shoesInfo.s_bottom_side_color = this.getValueFromListById(this.baseDatas.bottomSideColorList, shoesInfo.s_bottom_side_color);
    shoesInfo.s_gen_gao = this.getValueFromListById(this.baseDatas.genGaoList, shoesInfo.s_gen_gao);
    return shoesInfo;
  }

  createOrder= ():void => {

  }

  addToCart= ():void => {
    
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
        if (key.indexOf('editor_') === -1) {
          ret[key] = value[key];
        }
      }
      return ret;
    }

    return null;
  }
}
