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
    return this.api.getDefaultProfile({phone:phone}, tag||'customerProfile', graphqlTypes.customerType, true).then((result)=>{
      if(result.code === 0) {
        return result.data.customerProfile;
      }
      return null;
    });
  };

  getCustomerLastSubOrder(tag: string, type: string, id: string): Promise<any> {
    let conditions = {type:type};
    let options = {sort:{create_time:"desc"}}
    let query = `
      query Query {
        ${tag}:customerOrderInfo(id:"${id}", conditions:"${encodeURIComponent(JSON.stringify(conditions))}", options:"${encodeURIComponent(JSON.stringify(options))}")${orderTypes.subOrderType}
      }
    `;
    return this.api.graphqlJson(constants.API_SERVER_ADDRESS, query, false);
  }

  getCustomerReportList(guideId: string, conditions: any): Promise<any> {
    let query = `
      query Query {
        customerReportList(id:"${guideId}", conditions:"")${graphqlTypes.customerReportType}
      }
    `;
    return this.api.graphqlJson(constants.API_SERVER_ADDRESS, query, true);
  }
}
