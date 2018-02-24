import { Component, Input, OnInit, NgModule } from '@angular/core';
import { NavController, ToastController, NavParams, ViewController, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment'

import { CustomerData } from '../../../interface/customer-data'
import { HeaderData } from '../../../interface/header-data';
import { FormValidator } from '../../../utils/form-validator'
import { CustomerProvider, CommonProvider } from '../../../providers'
import * as constants from '../../../constants/constants'


@Component({
  selector: 'order-feedback',
  templateUrl: 'feedback.html'
})
export class OrderFeedbackComponent implements OnInit {
  headerData: HeaderData = {title:'填写反馈', menuEnable:false, type:'order-feedback'}
  currentFeedback: any = null;
  currentSuborderId: string = '';
  message:string = '';

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    public viewCtrl: ViewController,
    private toastCtrl: ToastController,
    private customerProvider: CustomerProvider,
    private commonProvider: CommonProvider,
    private navParams: NavParams,
    private events: Events
  ) {
    this.currentFeedback = navParams.get('feedback');
    this.currentSuborderId = navParams.get('suborderId');
  }

  ngOnInit(): void {
  }

  ionViewDidLoad(): void {
  }

  // 确定
  btnSureClicked = (value) => {
    if (!this.message) {
      this.toastCtrl.create({
        message:'请填写反馈内容',
        duration:1500,
        position:'middle'
      }).present();

      return;
    }

    this.commonProvider.updateSuborderTryFeedback(this.currentFeedback._id, {status:constants.E_ORDER_TRY_FEEDBACK_STATUS.END, suborder_id:this.currentSuborderId, message:this.message}).then((data)=> {
      if (data.code === 0) {
        this.viewCtrl.dismiss();
        this.events.publish('order-track:refresh')
      }
    })
  }

  // 入库
  btnInboundClicked = (value) => {

  }

}
