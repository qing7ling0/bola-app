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
      let fnMergeList = (list) => {
        if (!list) return [];
        list = list.map(item=>{
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
        list.forEach((item, index) => {
          if (!tempInfo[item.material]) {
            tempInfo[item.material] = {material:item.material, value:0};
          }
          tempInfo[item.material].value += item.count;
        });
        let newList = [];
        for(let key in tempInfo) {
          newList.push(tempInfo[key]);
        }

        return newList;
      }
      data.analyseGoodsMaterialList4Quarter = data.analyseGoodsMaterialList4Quarter.map(item=>{
        return fnMergeList(item);
      })
    }

    return data;
  }

  getBaseGoodsAnalyQuery(dateType) {
    return `
      analyseGoodsTop10(date_type:${dateType})${analyseTypes.analyseGoodsType}
      analyseGoodsSalesPer(date_type:${dateType})
      analyseGoodsMaterial(date_type:${dateType})${analyseTypes.analyseGoodsMaterialType}
      analyseGoodsSex(date_type:${dateType})${analyseTypes.analyseGoodsSexType}
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
        analyseGoodsPrice(date_type:${dateType})${analyseTypes.analyseGoodsPriceType}
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
        analyseGoodsPrice(date_type:${dateType})${analyseTypes.analyseGoodsPriceType}
        analyseGoodsMaterialList4Quarter(date_type:${dateType})${analyseTypes.analyseGoodsQuarterMaterialType}
        analyseGoodsSexList4Quarter(date_type:${dateType})${analyseTypes.analyseGoodsSexType}
        analyseGoodsPriceList4Quarter(date_type:${dateType}){
          list ${analyseTypes.analyseGoodsPriceType}
          types
        }
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
