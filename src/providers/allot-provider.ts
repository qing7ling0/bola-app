import { Injectable } from '@angular/core';

import { Events, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import * as constants from '../constants/constants'
import { API } from '../api/api'
import * as graphqlTypes from '../api/graphqlTypes'
import * as orderTypes from '../api/orderTypes'


@Injectable()
export class AllotProvider {
  constructor(
    public events: Events,
    public storage: Storage,
    public toastCtrl: ToastController,
    public api: API
  ) {}

  getSampleList(conditions:any, page:number=-1, pageSize:number=constants.DEFAULT_PAGE_SIZE): Promise<any> {
    return this.api.getDefaultList('sampleGoodsList', orderTypes.sampleGoodsType, conditions, page, pageSize, true).then((result)=>{
      if(result.code === 0) {
        return result.data.sampleGoodsList;
      }
      return null;
    });
  }

  getSampleAllotList(conditions:any, page:number=-1, pageSize:number=constants.DEFAULT_PAGE_SIZE): Promise<any> {
    return this.api.getDefaultList('sampleAllotList', orderTypes.sampleAllotType, conditions, page, pageSize, true).then((result)=>{
      if(result.code === 0) {
        return result.data.sampleAllotList.list;
      }
      return null;
    });
  }

  // 调拨申请
  sampleAllotApply(doc: any) {
    return this.api.mutationDefault('sampleAllotApply', `{_id}`, {doc:doc}, true).then((result)=>{
      if(result.code === 0) {
        return result.data.sampleAllotApply;
      }
      return null;
    });
  }

  // 入库，完成
  sampleAllotInbound(id: string) {
    return this.api.mutationDefault('sampleAllotUpdate', graphqlTypes.resultType, {id:id, doc:{status:constants.E_SAMPLE_ALLOT_STATUS.COMPLETED}}, true).then((result)=>{
      return result;
    });
  }

  // 出库,快递中
  sampleAllotOutbound(id: string, doc:any) {
    doc.status = constants.E_SAMPLE_ALLOT_STATUS.TRANSPORT;
    return this.api.mutationDefault('sampleAllotUpdate', graphqlTypes.resultType, {id:id, doc:doc}, true).then((result)=>{
      return result;
    });
  }
}
