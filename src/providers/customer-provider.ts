import { Injectable } from '@angular/core';

import { Events, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { User } from '../interface/user'
import { NetUtils } from '../utils/net-utils'
import * as constants from '../constants/constants'
import { API } from '../api/api'
import * as graphqlTypes from '../api/graphqlTypes'
import * as orderTypes from '../api/orderTypes'


@Injectable()
export class CustomerProvider {
  constructor(
    public events: Events,
    public storage: Storage,
    public toastCtrl: ToastController,
    public api: API
  ) {}

  getCustomerProfile(phone: string, tag?: string): Promise<any> {
    return this.api.getDefaultProfile({phone:phone}, tag||'customerProfile', graphqlTypes.customerType).then((result)=>{
      if(result.code === 0) {
        return result.data.customerProfile;
      }
      return null;
    });
  };
}
