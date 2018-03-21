import { Injectable } from '@angular/core';

import { Events, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import * as constants from '../constants/constants'
import { API } from '../api/api'
import * as graphqlTypes from '../api/graphqlTypes'
import * as orderTypes from '../api/orderTypes'
import * as analyseTypes from '../api/analyseTypes'


@Injectable()
export class AnalyseProvider {
  constructor(
    public events: Events,
    public storage: Storage,
    public toastCtrl: ToastController,
    public api: API
  ) {}

  getShopAnalyseDayList(dateType:Number): Promise<any> {
    let query = `
      query Query {
        analyseShopList(date_type:${dateType})${analyseTypes.analysePriceType}
      }
    `;
    return this.api.graphqlJson(constants.API_SERVER_ADDRESS, query, true).then((result)=>{
      if(result.code === 0) {
        return result.data;
      }
      return null;
    });
  }

  getShopAnalyseWeekList(dateType:Number): Promise<any> {
    let query = `
      query Query {
        analyseShopList(date_type:${dateType})${analyseTypes.analysePriceType}
        analyseLast5Week
      }
    `;
    return this.api.graphqlJson(constants.API_SERVER_ADDRESS, query, true).then((result)=>{
      if(result.code === 0) {
        return result.data;
      }
      return null;
    });
  }

  getShopAnalyseMonthList(dateType:Number): Promise<any> {
    let query = `
      query Query {
        analyseShopList(date_type:${dateType})${analyseTypes.analysePriceType}
        analyseLast12Month
        analyseLast2Year12Month{year,yesteryear}
      }
    `;
    return this.api.graphqlJson(constants.API_SERVER_ADDRESS, query, true).then((result)=>{
      if(result.code === 0) {
        return result.data;
      }
      return null;
    });
  }

  getShopAnalyseYearList(dateType:Number): Promise<any> {
    let query = `
      query Query {
        analyseShopList(date_type:${dateType})${analyseTypes.analysePriceType}
        analyseLast5Year
        analyse4Quarter
      }
    `;
    return this.api.graphqlJson(constants.API_SERVER_ADDRESS, query, true).then((result)=>{
      if(result.code === 0) {
        return result.data;
      }
      return null;
    });
  }
}
