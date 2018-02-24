import { Injectable } from '@angular/core';

import { Events, ToastController, LoadingController } from 'ionic-angular';
import { Headers, Http } from '@angular/http';

import * as constants from '../constants/constants'
import { NetUtils } from '../utils/net-utils'
import { Utils } from '../utils/utils'
import * as graphqlTypes from './graphqlTypes'
import * as orderTypes from './orderTypes'

@Injectable()
export class API {
  static auth: string;
  constructor(
    public events: Events,
    public toastCtrl: ToastController,
    public http: Http,
    public loadingCtrl: LoadingController
  ) {}

  object2String(object: any): string {
    if (object === undefined || object === null) return '""';

    let ret = '';
    if (Utils.IsObject(object)) {
      let str = '';
      for(let key in object) {
        if (object[key] !== undefined && object[key] !== null) {
          str = str + (str.length>0?',':'') +  key + ':' + this.object2String(object[key]);
        }
      }
      ret = ret + '{' + str + '}';
    } else if (Utils.IsArray(object)) {
      let str = '';
      for(let value of object) {
        str = str + (str.length>0?',':'') + this.object2String(value);
      }
      ret = ret + '[' + str + ']';
    } else if (Utils.IsBoolean(object) || Utils.IsNumber(object)) {
      ret = ret + object;
    } else if (Utils.IsString(object)) {
      ret = ret + JSON.stringify(object);
    }

    return ret;
  }

  reqLogin(account: string, password: string, check:boolean): Promise<any> {
    API.auth = "";
    const graphqlValue =  `
      mutation Login {
        login(account:"${account}",password:"${password}",check:${check?true:false})${graphqlTypes.userType}
      }
    `;
    return this.graphqlJson(constants.API_LOGIN_SERVER_ADDRESS, graphqlValue, true);
  }

  reqLogout(): Promise<any> {
    API.auth = "";
    const graphqlValue =  `
      mutation Mutation {
        logout {
          success
        }
      }
    `;
    return this.graphqlJson(constants.API_SERVER_ADDRESS, graphqlValue, true)
  }


  getDefaultList(tag:string, type: any, conditions: any=null, pageIndex:number=-1, pageSize:number=constants.DEFAULT_PAGE_SIZE, waitting:boolean=false) {
    
    let _conditions = '';
    if (!Utils.ObjectIsEmpty(conditions)) {
      _conditions = `, conditions: "${encodeURIComponent(JSON.stringify(conditions))}"`
    }

    if (pageIndex === undefined || pageIndex === null) {
      pageIndex = -1;
      pageSize = 0;
    } 
    
    let query = `
      query Query {
        ${tag}(page:${pageIndex}, pageSize:${pageSize} ${_conditions})${graphqlTypes.pageListType(type)}
      }
    `;
    return this.graphqlJson(constants.API_SERVER_ADDRESS, query, waitting);
  }
  
  getDefaultProfileById(id, tag, type, waitting?:boolean) {
    let query = `
      query Query {
        ${tag}(id:"${id}")${type}
      }
    `;
    return this.graphqlJson(constants.API_SERVER_ADDRESS, query, waitting);
  }

  getDefaultProfile(conditions, tag, type, waitting?:boolean) {
    let query = `
      query Query {
        ${tag}(conditions:"${encodeURIComponent(JSON.stringify(conditions))}")${type}
      }
    `;
    return this.graphqlJson(constants.API_SERVER_ADDRESS, query, waitting);
  }
  
  addDefault(tag, type, data, waitting?:boolean) {
    let name = tag;
    let index = tag.lastIndexOf('List');
    if (index !== -1) {
      name = tag.substring(0, index);
    }
    console.log(JSON.stringify(data));
    let mut = `
      mutation Mutation {
        ${name}Add(doc:${this.object2String(data)})${type}
      }
    `
    return this.graphqlJson(constants.API_SERVER_ADDRESS, mut, waitting);
  }

  deleteDefault(tag, ids, waitting?:boolean) {
    let name = tag;
    let index = tag.lastIndexOf('List');
    if (index !== -1) {
      name = tag.substring(0, index);
    }
    let mut = `
      mutation Mutation {
        ${name}Remove(ids:${this.object2String(ids)})
      }
    `    
    return this.graphqlJson(constants.API_SERVER_ADDRESS, mut, waitting);
  }

  updateDefault(tag, id, data, waitting?:boolean) {
    let name = tag;
    let index = tag.lastIndexOf('List');
    if (index !== -1) {
      name = tag.substring(0, index);
    }
    
    let mut = `
      mutation Mutation {
        ${name}Update(doc:${this.object2String(data)}, id:"${id}") ${graphqlTypes.resultType}
      }
    `    
    return this.graphqlJson(constants.API_SERVER_ADDRESS, mut, waitting);
  }

  httpGraphqlJson(url: string, data: any, waitting?:boolean) : Promise<any> {
    console.log('graphqlJson url' + url + '; data=' + data);
    let loader = null;
    if (waitting) {
      loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 1000 * 60
      });
      loader.present();
    }

    let headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/graphql',
      'auth':API.auth
    });
    var options = {
      headers: headers,
      credentials: 'include'
    };
    return this.http.post(url, data, options)
      .toPromise()
      .then((response) => {
        let auth = response.headers.get('auth');
        if (auth) {
          API.auth = auth;
        }
        loader && loader.dismiss();
        return response.json();
      })
      .catch((error) => {
        console.log(error);
        loader && loader.dismiss();
        return {code:-1, message:'网络连接失败', data:{}}
      });
  }

  graphqlJson(url: string, value: any, waitting:boolean=true) : Promise<any> {
    return this.httpGraphqlJson(url, value, waitting).then((data)=>{
      if(data.code > 0 && data.message) {
        this.toastCtrl.create({
          message:data.message,
          duration:1500,
          position:'middle'
        }).present();
      } else if (data.code < 0) {
        this.toastCtrl.create({
          message:'请求失败！',
          duration:1500,
          position:'middle'
        }).present();
      }

      return data;
    }).catch((error) => {
      this.toastCtrl.create({
        message:'请求失败！',
        duration:1500,
        position:'middle'
      }).present();
      return {code:-1, message:'请求失败！', data:[]};
    });
  }
}
