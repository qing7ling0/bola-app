import { Injectable } from '@angular/core';

import { Events, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

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
        customerReportList(id:"${guideId}", conditions:"${encodeURIComponent(JSON.stringify(conditions))}")${graphqlTypes.customerReportType}
      }
    `;
    return this.api.graphqlJson(constants.API_SERVER_ADDRESS, query, true).then((result)=>{
      if(result.code === 0) {
        return result.data.customerReportList;
      }
      return null;
    });
  }

  getCustomerShopReportList(conditions: any): Promise<any> {
    let query = `
      query Query {
        customerShopReportList(conditions:"${encodeURIComponent(JSON.stringify(conditions))}")${graphqlTypes.customerShopReportType}
      }
    `;
    return this.api.graphqlJson(constants.API_SERVER_ADDRESS, query, true).then((result)=>{
      if(result.code === 0) {
        return result.data.customerShopReportList;
      }
      return null;
    });
  }

  getCustomerReportInfo(guideId: string): Promise<any> {
    let query = `
      query Query {
        customerReportInfo(id:"${guideId}")${graphqlTypes.customerReportBaseType}
      }
    `;
    return this.api.graphqlJson(constants.API_SERVER_ADDRESS, query, true).then((result)=>{
      if(result.code === 0) {
        return result.data.customerReportInfo;
      }
      return null;
    });
  }

  getShopList(): Promise<any> {
    let query = `
      query Query {
        shopList(page:0, pageSize:0)${graphqlTypes.pageListType(graphqlTypes.shopType)}
      }
    `;
    return this.api.graphqlJson(constants.API_SERVER_ADDRESS, query, true).then((result)=>{
      if(result.code === 0) {
        return result.data.shopList.list;
      }
      return null;
    });
  }
}
