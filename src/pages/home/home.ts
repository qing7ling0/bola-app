import { Component } from '@angular/core';
import { NavController, Events } from 'ionic-angular';
import { NgForm } from '@angular/forms';

import { ShopPage } from '../shop/shop'
import { UserProvider } from '../../providers/user-provider'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  account={account:'', password:''}

  constructor(
    public events: Events,
    public navCtrl: NavController, 
    public userProvider: UserProvider
  ) {

    this.subscribeEvents();
  }

  viewDidLoad() {
  }

  login(form: NgForm) {
    this.userProvider.login(form.value.account, form.value.password)
  }
  
  subscribeEvents() {
    this.events.subscribe('user:login', () => {
      this.navCtrl.push(ShopPage);
    });

    this.events.subscribe('user:logout', () => {
    });
  }

}
