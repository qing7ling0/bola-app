import { Component, OnInit } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { FormBuilder, FormControl, FormGroup, Validators, NgForm } from '@angular/forms';

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
    private formBuilder: FormBuilder
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
    // this.accountGroup = new FormGroup({
    //   account: new FormControl(),
    //   password: new FormControl()
    // });
    console.log('ionViewDidLoad');
  }

  login(form: FormGroup) {
    if (form.valid) {
      this.userProvider.login(form.value.account, form.value.password)
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
