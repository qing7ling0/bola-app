export const DEBUG = true;

export const DEV_SERVER = 'http://127.0.0.1:3001';
export const PROD_SERVER = 'http://127.0.0.1:3001';

export const API_SERVER_ADDRESS = (DEBUG ? DEV_SERVER : PROD_SERVER) + '/api';
export const API_LOGIN_SERVER_ADDRESS = (DEBUG ? DEV_SERVER : PROD_SERVER) + '/login';

export const ACCOUNT_MAX_LENGTH = 20; // 账号密码最大长度
export const ACCOUNT_MIN_LENGTH = 5; // 账号密码最小长度
export const ACCCOUNT_NAME_MAX_LENGTH = 10; // 账号真实名称最大长度

export const E_ORDER_TYPE = {
  SHOES:'1', BELT:'2', WATCH_STRAP:'3', MAINTAIN:'4', RECHARGE:'5', ORNAMENT:'6', DESIGN:'7'
}

export const ORDER_TYPES = [
  {id:E_ORDER_TYPE.SHOES, label:'鞋', etc:'X'},
  {id:E_ORDER_TYPE.BELT, label:'皮带', etc:'PD'},
  {id:E_ORDER_TYPE.WATCH_STRAP, label:'表带', etc:'BD'},
  {id:E_ORDER_TYPE.MAINTAIN, label:'护理', etc:'HL'},
  {id:E_ORDER_TYPE.ORNAMENT, label:'配饰', etc:'PS'},
  {id:E_ORDER_TYPE.RECHARGE, label:'充值', etc:'CZ'},
  {id:E_ORDER_TYPE.DESIGN, label:'来样', etc:'SD'},
]
