import * as constants from '../constants/constants'
import { NetUtils } from '../utils/net-utils'
import { Utils } from '../utils/utils'
import * as graphqlTypes from './graphqlTypes'
import * as orderTypes from './orderTypes'

export class API {
  static object2String(object: any): string {
    if (object === undefined || object === null) return '""';
    
    let ret = '';
    if (Utils.IsObject(object)) {
      let str = '';
      for(let key in object) {
        if (object[key] !== undefined && object[key] !== null) {
          str = str + (str.length>0?',':'') +  key + ':' + API.object2String(object[key]);
        } 
      }
      ret = ret + '{' + str + '}';
    } else if (Utils.IsArray(object)) {
      let str = '';
      for(let value of object) {
        str = str + (str.length>0?',':'') + API.object2String(value);
      }
      ret = ret + '[' + str + ']';
    } else if (Utils.IsBoolean(object) || Utils.IsNumber(object)) {
      ret = ret + object;
    } else if (Utils.IsString(object)) {
      ret = ret + JSON.stringify(object);
    }

    return ret;
  }

  static reqLogin(account: string, password: string, check:boolean): Promise<any> {
    const graphqlValue =  `
      mutation Login {
        login(account:"${account}",password:"${password}",check:${check?true:false})${graphqlTypes.userType}
      }
    `;
    return API.graphqlJson(constants.API_LOGIN_SERVER_ADDRESS, graphqlValue)
  }

  static reqLogout(): Promise<any> {
    const graphqlValue =  `
      mutation Mutation {
        logout {
          success
        }
      }
    `;
    return API.graphqlJson(constants.API_SERVER_ADDRESS, graphqlValue)
  }

  static graphqlJson(url: string, value: any) : Promise<any> {
    return NetUtils.graphqlJson(url, value);
  }
}