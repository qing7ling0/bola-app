import { Injectable } from '@angular/core';

import { Events, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import * as constants from '../constants/constants'
import { API } from '../api/api'


@Injectable()
export class UserProvider {
  constructor(
    public events: Events,
    public storage: Storage,
    public toastCtrl: ToastController,
    public api: API
  ) {}

  login(account: string, password: string): void {
    this.setAccount(account, password);
    this.api.reqLogin(account, password, false).then((result)=>{
      if(result.code === 0) {
        this.storage.set('user', result.data.login);
        this.events.publish('user:login');
      }
    });
  };

  logout(): void {
    this.storage.remove('account');
    this.events.publish('user:logout');
  };

  setAccount(account: string, password: string): void {
    this.storage.set('account', {account:account, password:password});
  };

  getLastLoginAccount(): Promise<string> {
    return this.storage.get('account').then((value) => {
      return value;
    });
  };
}
