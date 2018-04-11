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

  formatAnalyGoodsList = (data: any): any => {
    if (!data) return data;

    if (data.analyseGoodsTop10) {
      data.analyseGoodsTop10 = data.analyseGoodsTop10.map(item=>{
        let material = "";
        if (item.s_material) {
          material = item.s_material;
        } else if (item.b_material) {
          material = item.b_material;
        } else if (item.ws_material) {
          material = item.ws_material;
        }
        item.material = material;
        return item;
      })
    }
    if (data.analyseGoodsMaterialList4Quarter) {
      let list = data.analyseGoodsMaterialList4Quarter.map(item=>{
        let material = "";
        if (item.s_material) {
          material = item.s_material;
        } else if (item.b_material) {
          material = item.b_material;
        } else if (item.ws_material) {
          material = item.ws_material;
        }
        item.material = material;
        return item;
      })

      let tempInfo = {};
      list.array.forEach((item, index) => {
        let data = null;
        if (tempInfo[item.material]) {
          data = tempInfo[item.material];
        } else {
          tempInfo[item.material] = {material:item.material, count:0};
        }
        data.count += item.count;
      });
      data.analyseGoodsMaterialList4Quarter = [];
      for(let key in tempInfo) {
        data.analyseGoodsMaterialList4Quarter.push(tempInfo[key]);
      }
      data.analyseGoodsMaterialList4Quarter.sort((a,b)=>a.count>b.count?1:-1);
    }

    return data;
  }

  getBaseGoodsAnalyQuery(dateType) {
    return `
      analyseGoodsTop10(date_type:${dateType})${analyseTypes.analyseGoodsType}
      analyseGoodsSalesPer
      analyseGoodsMaterial${analyseTypes.analyseGoodsMaterialType}
      analyseGoodsSex${analyseTypes.analyseGoodsSexType}
    `
  }

  getGoodsAnalyseDayList(dateType:Number): Promise<any> {
    let query = `
      query Query {
        ${this.getBaseGoodsAnalyQuery(dateType)}
      }
    `;
    return this.api.graphqlJson(constants.API_SERVER_ADDRESS, query, true).then((result)=>{
      if(result.code === 0) {
        result.data = this.formatAnalyGoodsList(result.data);
        return result.data;
      }
      return null;
    });
  }

  getGoodsAnalyseWeekList(dateType:Number): Promise<any> {
    let query = `
      query Query {
        ${this.getBaseGoodsAnalyQuery(dateType)}
      }
    `;
    return this.api.graphqlJson(constants.API_SERVER_ADDRESS, query, true).then((result)=>{
      if(result.code === 0) {
        result.data = this.formatAnalyGoodsList(result.data);
        return result.data;
      }
      return null;
    });
  }

  getGoodsAnalyseMonthList(dateType:Number): Promise<any> {
    let query = `
      query Query {
        ${this.getBaseGoodsAnalyQuery(dateType)}
        analyseGoodsPrice${analyseTypes.analyseGoodsPriceType}
      }
    `;
    return this.api.graphqlJson(constants.API_SERVER_ADDRESS, query, true).then((result)=>{
      if(result.code === 0) {
        result.data = this.formatAnalyGoodsList(result.data);
        return result.data;
      }
      return null;
    });
  }

  getGoodsAnalyseYearList(dateType:Number): Promise<any> {
    let query = `
      query Query {
        ${this.getBaseGoodsAnalyQuery(dateType)}
        analyseGoodsPrice${analyseTypes.analyseGoodsPriceType}
        analyseGoodsMaterialList4Quarter${analyseTypes.analyseGoodsQuarterMaterialType}
        analyseGoodsSexList4Quarter${analyseTypes.analyseGoodsSexType}
        analyseGoodsPriceList4Quarter${analyseTypes.analyseGoodsPriceType}
      }
    `;
    return this.api.graphqlJson(constants.API_SERVER_ADDRESS, query, true).then((result)=>{
      if(result.code === 0) {
        result.data = this.formatAnalyGoodsList(result.data);
        return result.data;
      }
      return null;
    });
  }
}
