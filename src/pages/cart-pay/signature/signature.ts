/**
 * 我的申请
 */

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavController, ToastController, NavParams, ViewController } from 'ionic-angular';
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
import { Signature } from '../../../utils/signature'
import SignaturePad from 'signature_pad';
const FORM_OPTIONS = (data)=> [
  {key:'NID', label:'货号', defaultValue:data&&data.NID||'', validators:[{key:'required', validator:Validators.required}]},
]


@Component({
  selector: 'page-signature',
  templateUrl: 'signature.html'
})
export class SignaturePage implements OnInit {
  headerData: HeaderData = {title:'样品调拨', menuEnable:false, type:'apply-list'};

  formOptions: Array<any>;
  formGroup: FormGroup;
  searchNID: string = '';
  applyList: Array<any>;
  applyListPage: any = {page:0,pageSize:0,total:0}
  loginUserId: string = '';
  loginUserShopId: string = '';
  isShopManager: Boolean = false;
  signaturePad:any = null;

  @ViewChild('canvas') canvas: ElementRef;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private viewCtrl: ViewController,
    private allotProvider: AllotProvider,
    private commonProvider: CommonProvider,
    private storage: Storage,
    public navParams: NavParams,
  ) {
    // let user = navParams.get('user');
    // if (user) {
    //   this.loginUserId = user._id;
    //   if (user.shop) {
    //     this.loginUserShopId = user.shop._id;
    //   }
    //   this.isShopManager = user.manager;
    // }
  }

  ngOnInit(): void {
    // this.formOptions = FORM_OPTIONS(null);
    // this.formGroup = this.formBuilder.group(FormValidator.getFormBuildGroupOptions(this.formOptions));
  }

  ionViewDidLoad(): void {
    // let con: any = {
    //   status:{$lt:constants.E_SAMPLE_ALLOT_STATUS.COMPLETED}
    // };
    // if (this.isShopManager) {
    //   con.apply_shop = this.loginUserShopId;
    // } else {
    //   con.apply_shop_guide = this.loginUserId;
    // }
    // this.allotProvider.getSampleAllotList(con).then((data:any) => {
    //   if (data) {
    //     this.applyList = data.list;
    //     this.applyListPage = data.page;
    //   }
    // })

    window.addEventListener("resize", this.resizeCanvas);
    // this.resizeCanvas();
    let root = document.getElementById('canvasRoot')
    this.canvas.nativeElement.width = root.offsetWidth;
    this.canvas.nativeElement.height = root.offsetHeight;
    this.signaturePad = new SignaturePad(this.canvas.nativeElement);
  }

  onBtnBackClicked = () => {
    this.viewCtrl.dismiss();
  }

  onBtnResetClicked = () => {
    this.signaturePad.clear();
  }

  onBtnSureClicked = () => {
    let data = this.signaturePad.toData();
  }

  resizeCanvas() {
    // var ratio =  Math.max(window.devicePixelRatio || 1, 1);
    // this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth * ratio;
    // this.canvas.nativeElement.height = this.canvas.nativeElement.offsetHeight * ratio;
    // this.canvas.nativeElement.getContext("2d").scale(ratio, ratio);
    // this.signaturePad.clear(); // otherwise isEmpty() might return incorrect value
  }
}
