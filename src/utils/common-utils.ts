import * as constants from '../constants/constants'


export const getMarketLevel = function(id) {
  for(let i=0; i<constants.MARKET_LEVEL.length; i++) {
    if (constants.MARKET_LEVEL[i].value === id) return constants.MARKET_LEVEL[i];
  }

  return null;
}

export const getShopPro = function(id) {
  for(let i=0; i<constants.SHOP_PRO.length; i++) {
    if (constants.SHOP_PRO[i].value === id) return constants.SHOP_PRO[i];
  }

  return null;
}

export const getCustomerType = function(id) {
  for(let i=0; i<constants.CUSTOMER_TYPE.length; i++) {
    if (constants.CUSTOMER_TYPE[i].value === id) return constants.CUSTOMER_TYPE[i];
  }

  return null;
}
export const getGoodsProperty = function(id) {
  for(let i=0; i<constants.GOODS_PROPERTY.length; i++) {
    if (constants.GOODS_PROPERTY[i].value === id) return constants.GOODS_PROPERTY[i];
  }

  return null;
}
export const getColorType = function(id) {
  for(let i=0; i<constants.COLOR_TYPE.length; i++) {
    if (constants.COLOR_TYPE[i].value === id) return constants.COLOR_TYPE[i];
  }

  return null;
}
export const getMaintainPriceType = function(id) {
  for(let i=0; i<constants.MAINTAIN_PRICE_TYPE.length; i++) {
    if (constants.MAINTAIN_PRICE_TYPE[i].value === id) return constants.MAINTAIN_PRICE_TYPE[i];
  }

  return null;
}
export const getOrderSource = function(id) {
  for(let i=0; i<constants.ORDER_SOURCE.length; i++) {
    if (constants.ORDER_SOURCE[i].value === id) return constants.ORDER_SOURCE[i];
  }

  return null;
}
export const getOrderType = function(id) {
  for(let i=0; i<constants.ORDER_TYPE.length; i++) {
    if (constants.ORDER_TYPE[i].value === id) return constants.ORDER_TYPE[i];
  }

  return null;
}
export const getPayType = function(id) {
}
export const getSex = function(id) {
  for(let i=0; i<constants.SEX_DATA.length; i++) {
    if (constants.SEX_DATA[i].value === id) return constants.SEX_DATA[i];
  }

  return null;
}

export const getOrderStatus = function(id) {
  for(let i=0; i<constants.ORDER_STATUS_LIST.length; i++) {
    if (constants.ORDER_STATUS_LIST[i].value === id) return constants.ORDER_STATUS_LIST[i];
  }

  return null;
}

export const urlString2Conditions = function(value) {
  if (!value) return '';
  let ret = JSON.parse(decodeURIComponent(value));
  for(let key in ret) {
    for(let subKey in ret[key]) {
      if (subKey === '$regex') {
        let v = ret[key][subKey];
        v = v.replace(/\/\//g,"\/");
        ret[key][subKey] = eval(v);//转成正则
      }
    }
  }

  return ret;
}

export const createGoodsNID = function(type, data, sex) {
  let NID = '';
  let sexData = getSex(sex);
  if (!sexData) return constants.NULL_NID;
  NID = sexData.etc;
  let order = getOrderType(type);
  if(!order) return constants.NULL_NID;
  NID += order.etc;

  switch(type) {
    case constants.GOODS_SHOES:
      for(let key of constants.GOODS_SHOES_NID_FIELDS) {
        if (key === 's_gen_gao') {
          if (sex !== constants.SEX_FEMALE) continue;
        }
        if (data[key] && data[key].NID) {
          NID += data[key].NID;
        } else {
          console.log('createGoodsNID shoes fail key=' + key);
          return constants.NULL_NID;
        }
      }

      return NID;
    case constants.GOODS_BELT:
      for(let key of constants.GOODS_BLET_NID_FIELDS) {
        if (data[key] && data[key].NID) {
          NID += data[key].NID;
        } else {
          return constants.NULL_NID;
        }
      }
      return NID;
    case constants.GOODS_WATCH_STRAP:
      for(let key of constants.GOODS_WATCH_STRAP_NID_FIELDS) {
        if (data[key] && data[key].NID) {
          NID += data[key].NID;
        } else {
          return constants.NULL_NID;
        }
      }
      return NID;

    case constants.GOODS_ORNAMENT:
      
    return NID;
  }
}

const _getPowerByType = function(powerId, powerType) {
  for(let powerInfo of constants.Powers) {
    if (powerInfo.id == powerId) {
      for(let power of powerInfo.powers) {
        if (power.id == powerType) {
          let ret = {add:false, edit:false, ...power.power, canOperate:false};
          ret.canOperate = ret.add || ret.edit;
          return ret;
        }
      }
    }
  }

  return {};
}

export const getPowerByType = _getPowerByType;

export const getPower= function(user, powerId) {
  if (!user) return {};
  let powerType = 0;
  switch(user.user_type) {
    case constants.USER_TYPES.shopGuide:
      powerType = user.manager ? constants.POWER_TYPES.SHOP_MANAGER : constants.POWER_TYPES.SHOP_GUIDE;
      return getPowerByType(powerId, powerType);
    case constants.USER_TYPES.operate:
      powerType = constants.POWER_TYPES.MANAGER_NORMAL;
      return getPowerByType(powerId, powerType);
    case constants.USER_TYPES.production:
      powerType = constants.POWER_TYPES.FACTORY_PRODUCTION;
      return getPowerByType(powerId, powerType);
    case constants.USER_TYPES.admin:
      return {view:true, add:true, edit:true, canOperate:true}
    default:
    break;
  }

  return {};
}