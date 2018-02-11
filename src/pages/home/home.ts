import { Component, OnInit } from '@angular/core';
import { NavController, Events, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ShopPage } from '../shop/shop'
import { UserProvider } from '../../providers/user-provider'
import * as constants from '../../constants/constants'


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  account = {account:'', password:''}
  accountGroup: FormGroup;

  constructor(
    public events: Events,
    public navCtrl: NavController,
    public userProvider: UserProvider,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController
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

  ionViewDidLoad() {
    this.userProvider.getLastLoginAccount().then((data: any)=>{
      if (data) {
        this.accountGroup.controls.account.setValue(data.account);
        this.accountGroup.controls.password.setValue(data.password);
      }
    });
  }

  login(form: FormGroup) {
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
      this.navCtrl.push(ShopPage);
    });

    this.events.subscribe('user:logout', () => {
    });
  }

}
