export const DEBUG = true;

export const DEV_SERVER = 'http://127.0.0.1:3001';
export const PROD_SERVER = 'http://127.0.0.1:3001';

export const API_SERVER_ADDRESS = (DEBUG ? DEV_SERVER : PROD_SERVER) + '/api';
export const API_LOGIN_SERVER_ADDRESS = (DEBUG ? DEV_SERVER : PROD_SERVER) + '/login';

export const ACCOUNT_MAX_LENGTH = 20; // 账号密码最大长度
export const ACCOUNT_MIN_LENGTH = 5; // 账号密码最小长度
export const ACCCOUNT_NAME_MAX_LENGTH = 10; // 账号真实名称最大长度