import { Component, Input, OnInit } from '@angular/core';
import { NavController, ToastController, AlertController, ModalController, Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import moment from 'moment'

import { CustomerData } from '../../../interface/customer-data'
import { FormValidator } from '../../../utils/form-validator'
import { CustomerProvider, CommonProvider } from '../../../providers'
import * as constants from '../../../constants/constants'

import { OrderShoesPage } from '../../order-create/shoes/shoes'
import { OrderShoesDesignPage } from '../../order-create/shoes-design/shoes-design'
import { OrderBeltPage } from '../../order-create/belt/belt'
import { OrderWatchStrapPage } from '../../order-create/watch-strap/watch-strap'
import { OrderMaintainPage } from '../../order-create/maintain/maintain'
import { OrderOrnamentPage } from '../../order-create/ornament/ornament'

import { OrderFeedbackComponent } from '../feedback.component/feedback.component';

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
    private commonProvider: CommonProvider,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private events: Events
  ) {
    this.suborderInfo = null;
  }

  ngOnInit(): void {
    this.getTryFeedbackList();
  }

  ionViewDidLoad(): void {
  }

  getTryFeedbackList = () => {
    if (!this.suborderInfo) return;
    this.commonProvider.getTryFeedbackList({suborder_id:this.suborderInfo._id}).then((list)=>{
      this.setCurrentFeedBack(list);
    });
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

  getDate = () => {
    return this.suborderInfo && moment(this.suborderInfo.create_time).format("YYYY/MM/DD HH:mm:ss");
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
  btnViewOrderClicked = () => {
    if (!this.suborderInfo) {
      return;
    }
    let goods = this.suborderInfo;
    let customer = this.suborderInfo.customer;
    let viewProfile = true;
    switch(goods.type) {
      case constants.E_ORDER_TYPE.SHOES:
      this.navCtrl.push(OrderShoesPage, {viewProfile, customer, goods})
      break;
      case constants.E_ORDER_TYPE.BELT:
      this.navCtrl.push(OrderBeltPage, {viewProfile, customer, goods})
      break;
      case constants.E_ORDER_TYPE.WATCH_STRAP:
      this.navCtrl.push(OrderWatchStrapPage, {viewProfile, customer, goods})
      break;
      case constants.E_ORDER_TYPE.MAINTAIN:
      this.navCtrl.push(OrderMaintainPage, {viewProfile, customer, goods})
      break;
      case constants.E_ORDER_TYPE.ORNAMENT:
      this.navCtrl.push(OrderOrnamentPage, {viewProfile, customer, goods})
      break;
      case constants.E_ORDER_TYPE.DESIGN:
      this.navCtrl.push(OrderShoesDesignPage, {viewProfile, customer, goods})
      break;
    }
  }

  // 出库
  btnOutboundClicked = () => {
    this.commonProvider.changeSuborderState(this.suborderInfo._id, {state:constants.E_ORDER_STATUS.OUTBOUND}).then((data)=>{
      if (data.code === 0) {
        this.events.publish('order-track:refresh');
      }
    });
  }

  // 入库
  btnInboundClicked = () => {
    this.commonProvider.changeSuborderState(this.suborderInfo._id, {state:constants.E_ORDER_STATUS.INBOUND}).then((data)=>{
      if (data.code === 0) {
        this.events.publish('order-track:refresh');
      }
    });
  }

  // 修改试脚鞋
  btnModifyTryClicked = (value) => {
    let profileModal = this.modalCtrl.create(OrderFeedbackComponent, {feedback:this.currentFeedback, suborderId:this.suborderInfo._id});
    profileModal.present();
  }

  // 正品投产
  btnProductionClicked = (value) => {
    if (!this.suborderInfo) return;

    let alert = this.alertCtrl.create({
      title: '提示',
      subTitle: '确定到正品鞋投产阶段吗，确定后无法返回?',
      buttons: [
        {
          text: '取消',
          handler: data => {
          }
        },
        {
          text: '确定',
          handler: data => {
            this.commonProvider.changeSuborderState(this.suborderInfo._id, {state:constants.E_ORDER_STATUS.MAKING}).then((data)=>{
              if (data.code === 0) {
                this.events.publish('order-track:refresh');
              }
            });
          }
        }
      ]
    });
    alert.present();

  }

  // 完成订单
  btnFinishClicked = (value) => {
    this.commonProvider.changeSuborderState(this.suborderInfo._id, {state:constants.E_ORDER_STATUS.COMPLETED}).then((data)=>{
      if (data.code === 0) {
        this.events.publish('order-track:refresh');
      }
    });
  }

}
