/**
 * 我的申请
 */

import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, ToastController, NavParams, ModalController, ViewController, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Storage } from '@ionic/storage';
import moment from 'moment'

import { OrderCustomerEditComponent } from '../../order-create/customer-edit/customer-edit.component';
import { FormValidator } from '../../../utils/form-validator'
import { CartListPage } from '../../cart-list/cart-list'
import { OrderCreatePage } from '../../order-create/order-create'
import { OrderTrackPage } from '../../order-track/order-track'
import { HeaderData } from '../../../interface/header-data';
import { AllotProvider, CommonProvider } from '../../../providers'
import { Utils } from '../../../utils/utils';
import * as graphqlTypes from '../../../api/graphqlTypes'
import * as constants from '../../../constants/constants'

const FORM_OPTIONS = (data)=> [
  {key:'apply_shop_name', label:'收货店铺', defaultValue:data&&data.allot&&data.allot.apply_shop&&data.allot.apply_shop.name||'', validators:[]},
  {key:'transport_company', label:'快递公司', defaultValue:data&&data.allot&&data.allot.transport_company||'', validators:[]},
  {key:'transport_id', label:'快递单号', defaultValue:data&&data.allot&&data.allot.transport_id||'', validators:[]},
  {key:'transport_phone', label:'联系电话', defaultValue:data&&data.user&&data.user.phone||'', validators:[]},
]


@Component({
  selector: 'component-allot-outbound',
  templateUrl: 'outbound.html'
})
export class OutboundComponent implements OnInit {
  headerData: HeaderData = {title:'样品调拨2', menuEnable:false, type:'allot-outbound'};

  formOptions: Array<any>;
  formGroup: FormGroup;
  loginUserId: string = '';
  loginUserShopId: string = '';
  isShopManager: Boolean = false;
  allot: any = null;
  user: any = null;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController ,
    private allotProvider: AllotProvider,
    private commonProvider: CommonProvider,
    private storage: Storage,
    public navParams: NavParams,
    private events: Events,
    private viewCtrl:ViewController
  ) {
    this.allot = navParams.get('allot');
    this.user = navParams.get('user');
  }

  ngOnInit(): void {
    this.formOptions = FORM_OPTIONS(this);
    this.formGroup = this.formBuilder.group(FormValidator.getFormBuildGroupOptions(this.formOptions));
  }

  ionViewDidEnter(): void {
  }

  onSureClicked = () => {
    let value = {
      transport_company:this.formGroup.value.transport_company,
      transport_id:this.formGroup.value.transport_id,
      transport_phone:this.formGroup.value.transport_phone
    }
    this.allotProvider.sampleAllotOutbound(this.allot._id, value).then((data:any)=>{
      // this.events.publish('allot:outbound-success');
      this.viewCtrl.dismiss({success:data.code === 0});
    });
  }

}
