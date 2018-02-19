import { Injectable } from '@angular/core';

import { Events, ToastController } from 'ionic-angular';
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
    public http: Http
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
    return this.graphqlJson(constants.API_LOGIN_SERVER_ADDRESS, graphqlValue);
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
    return this.graphqlJson(constants.API_SERVER_ADDRESS, graphqlValue)
  }


  getDefaultList(tag:string, type: any, conditions: any=null, pageIndex:number=-1, pageSize:number=constants.DEFAULT_PAGE_SIZE) {
    
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
    return this.graphqlJson(constants.API_SERVER_ADDRESS, query);
  }
  
  getDefaultProfileById(id, tag, type) {
    let query = `
      query Query {
        ${tag}(id:"${id}")${type}
      }
    `;
    return this.graphqlJson(constants.API_SERVER_ADDRESS, query);
  }

  getDefaultProfile(conditions, tag, type) {
    let query = `
      query Query {
        ${tag}(conditions:"${encodeURIComponent(JSON.stringify(conditions))}")${type}
      }
    `;
    return this.graphqlJson(constants.API_SERVER_ADDRESS, query);
  }
  
  addDefault(tag, type, data) {
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
    return this.graphqlJson(constants.API_SERVER_ADDRESS, mut);
  }

  deleteDefault(tag, ids) {
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
    return this.graphqlJson(constants.API_SERVER_ADDRESS, mut);
  }

  updateDefault(tag, id, data) {
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
    return this.graphqlJson(constants.API_SERVER_ADDRESS, mut);
  }

  httpGraphqlJson(url: string, data: any) : Promise<any> {
    console.log('graphqlJson url' + url + '; data=' + data);
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
        return response.json();
      })
      .catch((error) => {
        console.log(error);
        return {code:-1, message:'网络连接失败', data:{}}
      });
  }

  graphqlJson(url: string, value: any) : Promise<any> {
    return this.httpGraphqlJson(url, value).then((data)=>{
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
