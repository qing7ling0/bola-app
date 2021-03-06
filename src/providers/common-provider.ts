import { Injectable } from '@angular/core';

import { Events, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import * as constants from '../constants/constants'
import { API } from '../api/api'
import * as graphqlTypes from '../api/graphqlTypes'
import * as orderTypes from '../api/orderTypes'


@Injectable()
export class CommonProvider {
  constructor(
    public events: Events,
    public storage: Storage,
    public toastCtrl: ToastController,
    public api: API
  ) {}

  getGoodsBaseDatas(): Promise<any> {
    let pageIndex = -1;
    let pageSize = 0;
    return this.api.graphqlJson(constants.API_SERVER_ADDRESS, `
      query Query {
        goodsStyleList:commonList(page:${pageIndex}, pageSize:${pageSize}, conditions: "${encodeURIComponent(JSON.stringify({type:constants.E_COMMON_DATA_TYPES.GOODS_STYLE}))}")${graphqlTypes.pageListType(graphqlTypes.salesBaseType)}
        goodsSeasonList:commonList(page:${pageIndex}, pageSize:${pageSize}, conditions: "${encodeURIComponent(JSON.stringify({type:constants.E_COMMON_DATA_TYPES.GOODS_SEASON}))}")${graphqlTypes.pageListType(graphqlTypes.salesBaseType)}
        goodsTypeList:commonList(page:${pageIndex}, pageSize:${pageSize}, conditions: "${encodeURIComponent(JSON.stringify({type:constants.E_COMMON_DATA_TYPES.GOODS_TYPE}))}")${graphqlTypes.pageListType(graphqlTypes.salesBaseType)}
        outColorList:commonList(page:${pageIndex}, pageSize:${pageSize}, conditions: "${encodeURIComponent(JSON.stringify({type:constants.E_COMMON_DATA_TYPES.SHOES_OUT_COLOR}))}")${graphqlTypes.pageListType(graphqlTypes.colorType)}
        inColorList:commonList(page:${pageIndex}, pageSize:${pageSize}, conditions: "${encodeURIComponent(JSON.stringify({type:constants.E_COMMON_DATA_TYPES.SHOES_IN_COLOR}))}")${graphqlTypes.pageListType(graphqlTypes.colorType)}
        bottomColorList:commonList(page:${pageIndex}, pageSize:${pageSize}, conditions: "${encodeURIComponent(JSON.stringify({type:constants.E_COMMON_DATA_TYPES.SHOES_BOTTOM_COLOR}))}")${graphqlTypes.pageListType(graphqlTypes.colorType)}
        bottomSideColorList:commonList(page:${pageIndex}, pageSize:${pageSize}, conditions: "${encodeURIComponent(JSON.stringify({type:constants.E_COMMON_DATA_TYPES.SHOES_BOTTOM_SIDE_COLOR}))}")${graphqlTypes.pageListType(graphqlTypes.colorType)}
        materialColorList:commonList(page:${pageIndex}, pageSize:${pageSize}, conditions: "${encodeURIComponent(JSON.stringify({type:constants.E_COMMON_DATA_TYPES.MATERIAL_COLOR}))}")${graphqlTypes.pageListType(graphqlTypes.colorType)}
        customList:commonList(page:${pageIndex}, pageSize:${pageSize}, conditions: "${encodeURIComponent(JSON.stringify({type:constants.E_COMMON_DATA_TYPES.CUSTOM}))}")${graphqlTypes.pageListType(graphqlTypes.customType)}
        urgentList:commonList(page:${pageIndex}, pageSize:${pageSize}, conditions: "${encodeURIComponent(JSON.stringify({type:constants.E_COMMON_DATA_TYPES.URGENT}))}")${graphqlTypes.pageListType(graphqlTypes.urgentType)}
        maintainList:commonList(page:${pageIndex}, pageSize:${pageSize}, conditions: "${encodeURIComponent(JSON.stringify({type:constants.E_COMMON_DATA_TYPES.MAINTAIN}))}")${graphqlTypes.pageListType(graphqlTypes.maintainType)}
        xuanHaoList:commonList(page:${pageIndex}, pageSize:${pageSize}, conditions: "${encodeURIComponent(JSON.stringify({type:constants.E_COMMON_DATA_TYPES.XUAN_HAO}))}")${graphqlTypes.pageListType(graphqlTypes.xuanHaoType)}
        guiGeList:commonList(page:${pageIndex}, pageSize:${pageSize}, conditions: "${encodeURIComponent(JSON.stringify({type:constants.E_COMMON_DATA_TYPES.SHOES_GUI_GE}))}")${graphqlTypes.pageListType(graphqlTypes.guiGeType)}
        genGaoList:commonList(page:${pageIndex}, pageSize:${pageSize}, conditions: "${encodeURIComponent(JSON.stringify({type:constants.E_COMMON_DATA_TYPES.SHOES_GEN_GAO}))}")${graphqlTypes.pageListType(graphqlTypes.genGaoType)}
        shoesTieBianList:commonList(page:${pageIndex}, pageSize:${pageSize}, conditions: "${encodeURIComponent(JSON.stringify({type:constants.E_COMMON_DATA_TYPES.SHOES_TIE_BIAN}))}")${graphqlTypes.pageListType(graphqlTypes.shoesTieBianType)}
        watchStrapStyleList:commonList(page:${pageIndex}, pageSize:${pageSize}, conditions: "${encodeURIComponent(JSON.stringify({type:constants.E_COMMON_DATA_TYPES.WATCH_STRAP_STYLE}))}")${graphqlTypes.pageListType(graphqlTypes.watchStrapStyleType)}
        materialList(page:${pageIndex}, pageSize:${pageSize})${graphqlTypes.pageListType(graphqlTypes.materialType)}
        rechargeList:commonList(page:${pageIndex}, pageSize:${pageSize}, conditions: "${encodeURIComponent(JSON.stringify({type:constants.E_COMMON_DATA_TYPES.RECHARGE_REWARD}))}")${graphqlTypes.pageListType(graphqlTypes.rechargeType)}
        vipLevelList:commonList(page:${pageIndex}, pageSize:${pageSize}, conditions: "${encodeURIComponent(JSON.stringify({type:constants.E_COMMON_DATA_TYPES.VIP}))}")${graphqlTypes.pageListType(graphqlTypes.vipLevelType)}
        colorPaletteList(page:${pageIndex}, pageSize:${pageSize})${graphqlTypes.pageListType(graphqlTypes.colorPaletteType)}
      }
    `, false).then((result)=>{
      if(result.code === 0) {
        return result.data;
      }
      return null;
    });
  }

  getMaterialList(): Promise<any> {
    return this.api.getDefaultList(`materialList`, graphqlTypes.materialType).then((result)=>{
      if(result.code === 0) {
        return result.data["materialList"].list;
      }
      return null;
    });
  };

  getCommonDataList(tag: string, type:string, graphqlType: string): Promise<any> {
    return this.api.getDefaultList(`${tag}:commonList`, graphqlType, {type:type}).then((result)=>{
      if(result.code === 0) {
        return result.data[tag].list;
      }
      return null;
    });
  };

  getVipLevelList(): Promise<any> {
    return this.api.getDefaultList('vipLevelList:commonList', graphqlTypes.vipLevelType, {type:constants.E_COMMON_DATA_TYPES.VIP}).then((result)=>{
      if(result.code === 0) {
        return result.data.vipLevelList.list;
      }
      return null;
    });
  };

  getRechargeList(): Promise<any> {
    return this.api.getDefaultList('rechargeList:commonList', graphqlTypes.rechargeType, {type:constants.E_COMMON_DATA_TYPES.RECHARGE_REWARD}).then((result)=>{
      if(result.code === 0) {
        return result.data.rechargeList.list;
      }
      return null;
    });
  };

  getGoodsList(tag: string, type: string, page:number=0, pageSize:number=0, waitting:boolean=false): Promise<any> {
    return this.api.getDefaultList(tag, graphqlTypes.goodsType, {goods:type}, page, pageSize, waitting).then((result)=>{
      if(result.code === 0) {
        return result.data;
      }
      return null;
    });
  }

  getSuborderList(conditions: any, page:number=0, pageSize:number=0, waitting:boolean=false) {
    return this.api.getDefaultList('subOrderList', orderTypes.subOrderType, conditions, page, pageSize, waitting).then((result)=>{
      if(result.code === 0) {
        return result.data.subOrderList.list;
      }
      return null;
    });
  }

  getTryFeedbackList(conditions: any, page:number=0, pageSize:number=0, waitting:boolean=false) {
    return this.api.getDefaultList('tryFeedbackList', orderTypes.suborderTryFeedback, conditions, page, pageSize, waitting).then((result)=>{
      if(result.code === 0) {
        return result.data.tryFeedbackList.list;
      }
      return null;
    });
  }

  updateSuborderTryFeedback(id:any, data: any) {
    return this.api.updateDefault('tryFeedback', id, data, true);
  }

  changeSuborderState(id:any, data:any) {
    return this.api.updateDefault('suborder', id, data, true);
  }

  getAppLastVersion(version) {
    
  }
}
