import { Component, OnInit } from '@angular/core';
import { NavController, Events, ToastController, ModalController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CodePush, InstallMode, SyncStatus, DownloadProgress } from '@ionic-native/code-push';

// import * as rasterizeHTML from 'rasterizehtml';
// import rasterizeHTML from '../../../node_modules/rasterizehtml/dist/rasterizeHTML.allinone.js';

import { ShopPage } from '../shop/shop'
import { SignaturePage } from '../cart-pay/signature/signature'
import { UserProvider } from '../../providers/user-provider'
import * as constants from '../../constants/constants'


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  account = {account:'', password:''}
  accountGroup: FormGroup;
  syncStatus: any = 0;
  testStatus: Array<any> = [];
  updateFinish: boolean = false;
  installing:boolean = false;
  downloadProgress: number = 0;
  version: number = 2;
  statusText: string = '';

  constructor(
    public events: Events,
    public navCtrl: NavController,
    public userProvider: UserProvider,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private modalCtrl: ModalController,
    private codePush: CodePush
  ) {
    this.subscribeEvents();
  }

  ngOnInit() {
    this.accountGroup = this.formBuilder.group({
      account: ['', [Validators.required, Validators.minLength(constants.ACCOUNT_MIN_LENGTH), Validators.maxLength(constants.ACCOUNT_MAX_LENGTH)]],
      password: ['', [Validators.required, Validators.minLength(constants.ACCOUNT_MIN_LENGTH), Validators.maxLength(constants.ACCOUNT_MAX_LENGTH)]],
    });
    console.log('ngOnInit');
  }

  ionViewDidEnter() {
    this.userProvider.getLastLoginAccount().then((data: any)=>{
      if (data) {
        this.accountGroup.controls.account.setValue(data.account);
        this.accountGroup.controls.password.setValue(data.password);
      }
    });

    this.sync();
  }

  sync() {

    try {
      this.testStatus.push("开始" + this.version);
      this.statusText = this.getStatusText();
      this.codePush.sync(
        {
          installMode:InstallMode.IMMEDIATE, mandatoryInstallMode:InstallMode.IMMEDIATE,
          updateDialog:{
            updateTitle:'有新的更新', 
            optionalInstallButtonLabel:'更新', 
            optionalIgnoreButtonLabel:'忽略', 
            mandatoryContinueButtonLabel:'更新',
            mandatoryUpdateMessage:'有新的版本啦，请更新！',
            optionalUpdateMessage:'有新的版本啦，请更新！'
          }
        },
        (progress:DownloadProgress)=>{
          if (progress.totalBytes === 0) {
            this.downloadProgress = 1;
          } else {
            this.downloadProgress = progress.receivedBytes/progress.totalBytes;
          }
        }
      )
      .subscribe((syncStatus) => {
        this.syncStatus = syncStatus;
        this.testStatus.push(syncStatus);
        this.statusText = this.getStatusText();
        switch(syncStatus) {
          case SyncStatus.CHECKING_FOR_UPDATE:
          case SyncStatus.IN_PROGRESS:
            this.updateFinish = false;
            this.installing = false;
          break;
          case SyncStatus.DOWNLOADING_PACKAGE:
          case SyncStatus.INSTALLING_UPDATE:
            this.installing = true;
          break;
          case SyncStatus.UP_TO_DATE:
          case SyncStatus.UPDATE_IGNORED:
          case SyncStatus.UPDATE_INSTALLED:
          case SyncStatus.ERROR:
            this.installing = false;
            this.updateFinish = true;
          break;
        }
      });

    } catch (error) {
      this.testStatus.push(error.message);
      this.statusText = this.getStatusText();
      this.updateFinish = true;
    }
  }

  getUpdateText = ()=> {
    return this.installing ? `正在安装中${new Number(this.downloadProgress*100).toFixed(2)}%` : '检查更新中';
  }

  getStatusText = () => {
    return this.testStatus.join(";");
  }

  rasterTest() {
    // var canvas:any = document.getElementById("canvas");
    // rasterizeHTML.drawHTML('Some ' +
    //                    '<span style="color: green; font-size: 20px;">HTML</span>' +
    //                    ' with an image',
    //                    ).then(function (renderResult) {
    //                      let x = 0;
    //                      x = 1;
    //                      canvas.getContext('2d').drawImage(renderResult.image, 10, 25);
    //                 });;
  }

  login(form: FormGroup) {

    // let profileModal = this.modalCtrl.create(SignaturePage, {});
    //   profileModal.onDidDismiss(data => {
    //   });
    //   profileModal.present();

    if (form.valid) {
      this.userProvider.login(form.value.account, form.value.password)
    } else {
      if (form.controls.account.hasError('required') ||form.controls.password.hasError('required')) {
        this.toastCtrl.create({
          message:'请填写账号密码！',
          duration:1500,
          position:'middle'
        }).present();
      } else if (
        form.controls.account.hasError('minlength') ||
        form.controls.account.hasError('maxlength') ||
        form.controls.password.hasError('minlength')||
        form.controls.password.hasError('maxlength')
      ) {
        this.toastCtrl.create({
          message:`账号密码不合法，输入${constants.ACCOUNT_MIN_LENGTH}-${constants.ACCOUNT_MAX_LENGTH}长度的英文和字母！`,
          duration:1500,
          position:'middle'
        }).present();
      }
    }
  }

  subscribeEvents() {
    this.events.subscribe('user:login', () => {
      this.navCtrl.setRoot(ShopPage);
    });

    this.events.subscribe('user:logout', () => {
    });
  }

}
