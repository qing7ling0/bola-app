import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { User } from '../interfaces/user'
import { NetUtils } from '../utils/net-utils'
import * as constants from '../constants/constants'
import { API } from '../api/api'


@Injectable()
export class UserProvider {
  constructor(
    public events: Events,
    public storage: Storage
  ) {}

  login(account: string, password: string): void {
    this.setAccount(account, password);
    API.reqLogin(account, password, true).then((data)=>{
      this.events.publish('user:login');
    }).catch((error)=>{
      console.log('dddd' + error)
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
