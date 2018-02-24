import { Component, Input, OnInit } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CustomerData } from '../../../interface/customer-data'
import { FormValidator } from '../../../utils/form-validator'
import { CustomerProvider, CommonProvider } from '../../../providers'
import * as constants from '../../../constants/constants'


@Component({
  selector: 'order-track',
  templateUrl: 'track.html'
})
export class OrderTrackComponent implements OnInit {
  @Input() suborderInfo: any;
  @Input() onChange: Function;

  tryStep: number = 0;
  productStep: number = 0;
  tryFeedbackList: Array<any> = [];
  currentFeedback: any = null;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private customerProvider: CustomerProvider,
    private commonProvider: CommonProvider
  ) {
    this.suborderInfo = null;
  }

  ngOnInit(): void {
  }

  ionViewDidLoad(): void {
  }

  setCurrentFeedBack = (list) => {
    if(!list){
      this.currentFeedback = null;
      return;
    }
    let data = null;
    for(let item of list) {
      if (item.status !== constants.E_ORDER_TRY_FEEDBACK_STATUS.END) {
        data = item;
        break;
      }
    }
    this.currentFeedback = data;
  }

  isInTryStep(): boolean {
    if (!this.suborderInfo) {
      return true;
    }
    return this.suborderInfo.state < constants.E_ORDER_STATUS.MAKING;
  }

  isCanModify(): boolean {
    return this.getTryStep() > 1;
  }

  getTryStep(): number {
    if (!this.suborderInfo) {
      return 0;
    }

    if (this.suborderInfo.state === constants.E_ORDER_STATUS.REVIEW) {
      return 0;
    } else if (this.suborderInfo.state === constants.E_ORDER_STATUS.TRY || this.suborderInfo.state === constants.E_ORDER_STATUS.TRY_TRANSPORT) {
      if (!this.currentFeedback) {
        return 1;
      } else {
        switch(this.currentFeedback.status) {
          case constants.E_ORDER_TRY_FEEDBACK_STATUS.START:
            return 1;
          case constants.E_ORDER_TRY_FEEDBACK_STATUS.TRANSPORT:
            return 3;
          default:
          return 1;
        }
      }
    }
    return 0;
  }

  getProductionStep(): number {
    if (!this.suborderInfo) {
      return 0;
    }
    return this.suborderInfo.s_production_step || 0;
  }

  // 等待入库
  isWaitInbound(): boolean {
    if (!this.suborderInfo) {
      return false;
    }
    return this.suborderInfo.state === constants.E_ORDER_STATUS.TRANSPORT;
  }

  // 已入库
  isInbound(): boolean {
    if (!this.suborderInfo) {
      return false;
    }
    return this.suborderInfo.state === constants.E_ORDER_STATUS.INBOUND;
  }

  // 已出库
  isOutbound(): boolean {
    if (!this.suborderInfo) {
      return false;
    }
    return this.suborderInfo.state === constants.E_ORDER_STATUS.OUTBOUND;
  }

  // 查看订单
  btnViewOrderClicked = (value) => {

  }

  // 出库
  btnOutboundClicked = (value) => {

  }

  // 入库
  btnInboundClicked = (value) => {

  }

  // 修改试脚鞋
  btnModifyTryClicked = (value) => {

  }

  // 正品投产
  btnProductionClicked = (value) => {

  }

  // 完成订单
  btnFinishClicked = (value) => {

  }

}
