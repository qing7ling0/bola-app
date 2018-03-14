import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, Events, ModalController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { PhotoLibrary, LibraryItem } from '@ionic-native/photo-library';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import moment from 'moment'

import { API } from '../../api/api'
import { OrderCreatePage } from '../order-create/order-create'
import {HeaderData} from '../../interface/header-data';
import * as constants from '../../constants/constants'
import { CartProvider, CommonProvider } from '../../providers';
import * as commonUtils from '../../utils/common-utils'
import { SignaturePage } from './signature/signature'

@Component({
  selector: 'page-cart-pay',
  templateUrl: 'cart-pay.html'
})
export class CartPayPage {
  headerData: HeaderData = {title:'购物车结算', menuEnable:true, type:''};
  goodsList: Array<any>;
  customer: any;
  isUseStoreCard: boolean = false;
  isHasNeiGua: boolean = false;
  neiGuaPeopleData: any = null;
  payType: string = '';
  payInfo: any = {payPriceLabel:'0.00', discountPriceLabel:'0.00'};
  vipLevelList: Array<any>;
  FILE_URL: string = constants.API_FILE_SERVER_ADDRESS + '/';
  shopId: string = '';
  guideId: string = '';
  payTypeList: Array<any> = constants.PAY_TYPE;
  signaturePic: string = '';

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    private cartProvider: CartProvider,
    private commonProvider: CommonProvider,
    private storage: Storage,
    private alertCtrl: AlertController,
    private events: Events,
    private transfer: FileTransfer,
    private file: File,
    private photoLibrary: PhotoLibrary
  ) {
    this.goodsList = navParams.get('goodsList');
    this.customer = navParams.get('customer');
    let guide = navParams.get('guide');
    if (guide) {
      this.shopId = guide.shopId;
      this.guideId = guide.guideId;
    }
  }

  ionViewDidEnter(): void {
    this.commonProvider.getVipLevelList().then((data:Array<any>) => {
      if (data) {
        this.vipLevelList = data;

        this.calcPayMount();
      }
    })
  }

  getGoodsPayPrice(goods: any): number {
    if (!goods) 0;
    let price = 0;
    price = goods.price;
    price += this.getGoodsCustomPrice(goods);
    if (goods.urgent) {
      price += goods.urgent.price;
    }

    return price;
  }

  getGoodsCustomPrice(goods: any): number {
    let price = 0;
    if (goods.s_customs) {
      for(let cu of goods.s_customs) {
        price += cu.price;
      }
    }

    return price;
  }

  onUseStoreCardChange = () => {
    this.calcPayMount();
  }
  onHasNeiGuaChange = () => {
    this.calcPayMount();
  }

  calcPayMount = ()=> {
    let payInfo = this.payInfo;
    payInfo.price = 0;
    payInfo.realPrice = 0;
    payInfo.customPrice = 0;
    payInfo.urgentPrice = 0;
    payInfo.discountPrice = 0;

    let price = 0;
    for(let good of this.goodsList) {
      payInfo.price += good.price;
      if (good.s_customs) {
        for(let cus of good.s_customs) {
          payInfo.customPrice += cus.price;
        }
      }

      if (good.urgent) {
        payInfo.urgentPrice = good.urgent.price;
      }
    }

    let discount = 1;
    if (!this.isUseStoreCard) {
      let list = this.vipLevelList || [];
      for(let lv of list) {
        if (lv.level === this.customer.vip_level) {
          discount = lv.discount/10;
          break;
        }
      }
    }
    payInfo.discount = discount;
    payInfo.realPrice = Math.round(payInfo.price * discount*10)/10;
    payInfo.discountPrice = (payInfo.price - payInfo.realPrice);
    payInfo.payPrice = payInfo.realPrice + payInfo.customPrice + payInfo.urgentPrice;
    payInfo.payPriceLabel = new Number(payInfo.payPrice).toFixed(2);
    payInfo.discountPriceLabel = new Number(payInfo.discountPrice).toFixed(2);
  }

  pay = () => {
    let alert = this.alertCtrl.create({
      title: '提示',
      subTitle: '请确认订单信息是否正确？',
      buttons: [
        {
          text: '取消',
          handler: data => {
          }
        },
        {
          text: '确定',
          handler: data => {
            this.onPay();
          }
        }
      ]
    });
    alert.present();
  }

  onPay() {
    if (!this.shopId) return;
    if (!this.payType) {
      this.toastCtrl.create({
        message:'请选择支付方式！',
        duration:1500,
        position:'middle'
      }).present();
      return;
    }
    this.calcPayMount();
    let payInfo = this.payInfo;
    let order:any = {};
    order.source = constants.ORDER_SOURCE[0].value;
    order.pay = payInfo.realPrice + payInfo.customPrice + payInfo.urgentPrice;
    order.pay_type = this.payType;
    order.store_card_selected = this.isUseStoreCard;
    order.cash_ticket_NID = ''; // 代金券
    order.signature_pic = this.signaturePic;

    let subOrders = [];
    for(let good of this.goodsList) {
      let sub = {...good};
      sub.shop = this.shopId;
      sub.guide = this.guideId;
      sub.customer = commonUtils.copyProperty(this.customer,['phone', 'name', 'sex', 'birthday', 'weixin', 'country', 'city', 'address', 'zipcode']);
      subOrders.push(sub);
    }
    order.sub_orders = subOrders;

    if (this.isUseStoreCard) {
      let canUseBalance = this.customer&&this.customer.balance || 0;
      if (order.pay > canUseBalance) {
        this.toastCtrl.create({
          message:'存储卡余额不足',
          duration:1500,
          position:'middle'
        }).present();

        return;
      }
    }

    this.cartProvider.addOrder(order).then((item)=> {
      if (item.code === 0) {
        this.toastCtrl.create({
          message:'下单成功!',
          duration:1500,
          position:'middle'
        }).present();
        this.events.publish('order:success');
        this.navCtrl.popToRoot();
      }
    });
  }

  onPaySignature() {
    let profileModal = this.modalCtrl.create(SignaturePage, {});
    profileModal.onDidDismiss(data => {
      if (data) {
        this.photoLibrary.requestAuthorization().then(() => {
          this.photoLibrary.saveImage(data, `${this.customer.name}-${moment().format("YYYY-MM-DD HH:mm:ss")}.jpg`).then((saveImageResult:LibraryItem)=>{

          const fileTransfer: FileTransferObject = this.transfer.create();
          let header = {
            'auth':API.auth
          }
          // Upload a file:
          fileTransfer.upload(saveImageResult.photoURL, constants.API_UPLOAD_SERVER_ADDRESS, {mimeType:'image/*', fileKey:'order', headers:header}).then((result: any)=>{
            console.log(result);
            if (result.response) {
              let data = JSON.parse(result.response);
              if (data.data.files && data.data.files.length > 0) {
                this.signaturePic = data.data.files[0];
                this.onPay();
              } else {
                this.toastCtrl.create({
                  message:'签名文件上传失败!',
                  duration:1500,
                  position:'middle'
                }).present();
              }
            } else {
              this.toastCtrl.create({
                message:'签名文件上传失败!',
                duration:1500,
                position:'middle'
              }).present();
            }
          }).catch((error) => {
            console.log(error);
          });
          });
        })
        .catch(err => {
          this.toastCtrl.create({
            message:'没有权限访问相册!',
            duration:1500,
            position:'middle'
          }).present();
        });
      }
    });
    profileModal.present();
  }
}
