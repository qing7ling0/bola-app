import { Component, Input } from '@angular/core';
import { NavController, Events, ToastController } from 'ionic-angular';
import { FormBuilder, FormControl, FormGroup, Validators, NgForm } from '@angular/forms';

import {HeaderData} from '../../interface/header-data';

import * as constants from '../../constants/constants';
import { CartProvider } from '../../providers'
import { CartListPage } from '../../pages/cart-list/cart-list';

@Component({
  selector: 'header',
  templateUrl: 'header.html'
})
export class HeaderComponent {
  // @Input() title: string;
  @Input() headerData: HeaderData;

  constructor(
    public events: Events,
    public navCtrl: NavController,
    private toastCtrl: ToastController,
    private cartProvider: CartProvider
  ) {
    this.subscribeEvents();
  }

  back() : void {
    this.navCtrl.pop();
  }

  clearCartList = (): void => {
    this.cartProvider.clear();
  }

  openCartListPage = (): void => {
    this.navCtrl.push(CartListPage)
  }

  subscribeEvents() {
  }

}
