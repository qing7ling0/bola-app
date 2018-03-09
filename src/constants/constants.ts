export const DEBUG = true;

// export const DEV_SERVER = 'http://192.168.0.105:3001';
export const DEV_SERVER = 'http://127.0.0.1:3001';
export const PROD_SERVER = 'http://106.14.138.141:3001';

export const API_SERVER_ADDRESS = (DEBUG ? DEV_SERVER : PROD_SERVER) + '/api';
export const API_LOGIN_SERVER_ADDRESS = (DEBUG ? DEV_SERVER : PROD_SERVER) + '/login';
export const API_UPLOAD_SERVER_ADDRESS = (DEBUG ? DEV_SERVER : PROD_SERVER) + '/upload';
export const API_FILE_SERVER_ADDRESS = (DEBUG ? DEV_SERVER : PROD_SERVER) + '/file';

export const ACCOUNT_MAX_LENGTH = 20; // 账号密码最大长度
export const ACCOUNT_MIN_LENGTH = 5; // 账号密码最小长度
export const ACCCOUNT_NAME_MAX_LENGTH = 10; // 账号真实名称最大长度
export const DEFAULT_PAGE_SIZE = 20;

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


// 基础数据类型
export const E_COMMON_DATA_TYPES = {
  SHOES_OUT_COLOR:'1', // 鞋面颜色
  SHOES_IN_COLOR:'2', // 内里颜色
  SHOES_BOTTOM_COLOR:'3', // 鞋底颜色
  SHOES_BOTTOM_SIDE_COLOR:'4', // 鞋底边颜色
  MATERIAL_COLOR:'5', // 原材料颜色
  MATERIAL:'6', // 原材料
  CUSTOM:'7', // 特殊定制
  URGENT:'8', // 加急
  MAINTAIN:'9', // 护理
  GOODS_TYPE:'10', // 商品分类
  GOODS_STYLE:'11', // 商品系列
  GOODS_SEASON:'12', // 商品季节
  XUAN_HAO:'13', // 楦号
  WATCH_STRAP_STYLE:'14', // 表带类型
  SHOES_GEN_GAO:'15', // 跟高
  SHOES_GUI_GE:'16', // 规格
  SHOES_TIE_BIAN:'17', // 贴边,
  RECHARGE_REWARD:'18', // 充值奖励
  VIP:'19', // VIP等级
  CUSTOMER_TAGS:'20', // 客户标签
  SHOP_REGION:'21', // 店铺区域
}

export const MENU_IDS = {
  orga:                 1, // 组织架构

  shop:                 2, // 门店
  shopInfo:             201, // 门店信息
  shopGuide:            202, // 门店导购
  shopSales:            203, // 门店促销

  customer:             3, // 客户
  customerInfo:         301, // 客户信息
  customerBuy:          302, // 客户消费表
  customerOrder:        303, // 客户订单
  customerFeedback:     304, // 客户反馈记录

  sales:                4, // 进销存管理【商品，原材料，保养维护价目表】
  salesMaterial:        401, // 原材料
  salesItems:           402, // 商品
  salesOrder:           403, // 订单
  salesSampleGoods:     404, // 库存
  salesItemsBase:       405, // 商品基础数据

  report:               5,
  reportTable:          501, // 销售报表

  system:               9, // 系统管理
  systemSetting:        901, // 系统设置
  systemAdmin:          902, // 管理员账号管理

  activity:10, // 活动
  activityRecharge:     1001, // 充值奖励
  activityVIP:          1002, // vip等级
}

export const POWER_TYPES = {
  SALE_MANAGER:1, // 销售经理/区域经理/销售总监
  SHOP_MANAGER:2, // 店长
  SHOP_GUIDE:3, // 导购
  MANAGER_NORMAL:4, // 普通经理权限
  MANAGER_SENIOR:5, // 高级经理权限
  FACTORY_PRODUCTION:6, // 工厂制作人员
  ADMINISTRTOR:1000 // 系统管理员
}

/**
 * 用户类型
 */
export const USER_TYPES = {
  shopGuide:1, // 导购
  operate:2, // 运营
  production:3, // 生产人员
  admin:4, // 管理员
}

// 每个子订单可以上传的图片最大数量
export const ORDER_UPLOAD_PIC_MAX_COUNT = 10;

export const SEX_MAN = '男';
export const SEX_FEMALE = '女';

/** 性别数据 */
export const SEX_DATA = [
  {id:0, value:SEX_MAN, label:'男', etc:'BM'},
  {id:1, value:SEX_FEMALE, label:'女', etc:'BF'}
]

/** 商品属性，左脚，右脚，一双，一个 */
export const GOODS_PROPERTY = [
  {value:'左脚', label:'左脚'},
  {value:'右脚', label:'右脚'},
  {value:'一双', label:'一双'},
  {value:'一个', label:'一个'}
]

/** 店铺市场级别 */
export const MARKET_LEVEL = [
  {id:1, value:'1', label:'级别1'},
  {id:2, value:'2', label:'级别2'},
  {id:3, value:'3', label:'级别3'},
]

export const SHOP_PRO = [
  {id:1, value:'1', 'label':'非特卖'},
  {id:2, value:'2', 'label':'特卖'},
]

export const E_CUSTOMER_TYPE = {
  ORDER:'1',
  WEB:'2',
  ADMIN:'3',
  OTHER:'99'
}

/** 客户来源 */
export const CUSTOMER_TYPE = [
  {value:E_CUSTOMER_TYPE.ORDER, label:'订单'},
  {value:E_CUSTOMER_TYPE.WEB, label:'网站'},
  {value:E_CUSTOMER_TYPE.ADMIN, label:'后台'},
  {value:E_CUSTOMER_TYPE.OTHER, label:'其他'}
]

/** 维修保养改型 */
export const MAINTAIN_PRICE_TYPE = [
  {value:'1', label:'维修'},
  {value:'2', label:'保养'},
  {value:'3', label:'改型'}
]

/** 订单来源 */
export const ORDER_SOURCE = [
  {value:'1', label:'店铺'},
  {value:'2', label:'其他'}
]

/** 支付方式 */
export const PAY_TYPE = [
  {value:'1', label:'支付宝'},
  {value:'2', label:'微信'},
  {value:'3', label:'刷卡'},
  {value:'4', label:'现金'},
  {value:'5', label:'其他'},
]

export const COLOR_TYPE = [
  {value:'1', label:'鞋面'},
  {value:'2', label:'里皮'},
  {value:'3', label:'鞋底'},
  {value:'4', label:'底边'},
  {value:'5', label:'原材料'},
]

// order type
export const ORDER_TYPE = [
  {value:E_ORDER_TYPE.SHOES, label:'鞋', etc:'X'},
  {value:E_ORDER_TYPE.BELT, label:'皮带', etc:'PD'},
  {value:E_ORDER_TYPE.WATCH_STRAP, label:'表带', etc:'BD'},
  {value:E_ORDER_TYPE.MAINTAIN, label:'护理', etc:'HL'},
  {value:E_ORDER_TYPE.ORNAMENT, label:'配饰', etc:'PS'},
  {value:E_ORDER_TYPE.RECHARGE, label:'充值', etc:'CZ'},
  {value:E_ORDER_TYPE.DESIGN, label:'来样设计', etc:'SD'},
]

export const COLOR_TYPE_OUT = '1';
export const COLOR_TYPE_IN = '2';
export const COLOR_TYPE_BOTTOM = '3';
export const COLOR_TYPE_BOTTOM_SIDE = '4';
export const COLOR_TYPE_MATERIAL = '5';

export const GOODS_SHOES = E_ORDER_TYPE.SHOES; // 鞋
export const GOODS_BELT = E_ORDER_TYPE.BELT; // 皮带
export const GOODS_WATCH_STRAP = E_ORDER_TYPE.WATCH_STRAP; // 表带
export const GOODS_ORNAMENT = E_ORDER_TYPE.ORNAMENT; // 配饰
export const MAINTAIN = E_ORDER_TYPE.MAINTAIN; // 护理
export const GOODS_SHOES_NID_FIELDS = [
  's_xuan_hao', 's_material', 's_gui_ge',
  's_out_color', 's_in_color', 's_bottom_color',
  's_bottom_side_color', 's_gen_gao'
]; // 鞋子和编号关联字段
export const GOODS_BLET_NID_FIELDS = ['b_material', 'b_color']; // 皮带和编号关联字段
export const GOODS_WATCH_STRAP_NID_FIELDS = ['ws_material', 'ws_style']; // 表带和编号关联字段
export const NULL_NID = '不存在'; // 不存在的编号

export const E_DB_LOG_TYPES =  {
  ORDER: '1', // 订单操作
  COMMON: '2', // 基础数据操作
  CUSTOMER: '3', // 客户
  ADMIN: '4', // 管理员账号
  SHOP: '5', // 门店
  SHOP_GUIDE: '6', // 导购
}

export const RIGHT_FOOT_ID = '1';
export const LEFT_FOOT_ID = '2';

// 基础数据类型
export const COMMON_DATA_TYPES = {
  SHOES_OUT_COLOR:'1', // 鞋面颜色
  SHOES_IN_COLOR:'2', // 内里颜色
  SHOES_BOTTOM_COLOR:'3', // 鞋底颜色
  SHOES_BOTTOM_SIDE_COLOR:'4', // 鞋底边颜色
  MATERIAL_COLOR:'5', // 原材料颜色
  MATERIAL:'6', // 原材料
  CUSTOM:'7', // 特殊定制
  URGENT:'8', // 加急
  MAINTAIN:'9', // 护理
  GOODS_TYPE:'10', // 商品分类
  GOODS_STYLE:'11', // 商品系列
  GOODS_SEASON:'12', // 商品季节
  XUAN_HAO:'13', // 楦号
  WATCH_STRAP_STYLE:'14', // 表带类型
  SHOES_GEN_GAO:'15', // 跟高
  SHOES_GUI_GE:'16', // 规格
  SHOES_TIE_BIAN:'17', // 贴边,
  RECHARGE_REWARD:'18', // 充值奖励
  VIP:'19', // VIP等级
}

// 试脚鞋反馈状态
export const E_ORDER_TRY_FEEDBACK_STATUS = {
  START:10, // 开始
  TRANSPORT:20, // 发货
  END:30 // 结束
}

// 订单状态
export const E_ORDER_STATUS = {
  REVIEW: 100, // 审核
  TRY: 200, // 试脚鞋投产
  TRY_TRANSPORT:202, // 试脚鞋发货
  MAKING: 300, // 制作中
  MAKING_1: 301, // 帮面针车
  MAKING_2: 302, // 复底成型
  MAKING_3: 303, // 染色水洗
  MAKING_4: 304, // 品检出货
  DELIVERY:400, // 发货中
  TRANSPORT: 500, // 已发货，邮寄中
  INBOUND: 510, // 已入库
  OUTBOUND: 520, // 已出库
  SURE: 600, // 客户确认
  COMPLETED: 700, // 已完成
  REJECTED: 1000, // 退货,
  CANCEL: 2000, // 取消
};
export const ORDER_STATUS_LIST = [
  {value:E_ORDER_STATUS.REVIEW, label:'审核中'},
  {value:E_ORDER_STATUS.TRY, label:'试脚鞋投产'},
  {value:E_ORDER_STATUS.TRY_TRANSPORT, label:'试脚鞋制作寄出'},
  {value:E_ORDER_STATUS.MAKING, label:'制作中'},
  {value:E_ORDER_STATUS.MAKING_1, label:'帮面针车'},
  {value:E_ORDER_STATUS.MAKING_2, label:'复底成型'},
  {value:E_ORDER_STATUS.MAKING_3, label:'染色水洗'},
  {value:E_ORDER_STATUS.MAKING_4, label:'品检出货'},
  {value:E_ORDER_STATUS.TRANSPORT, label:'已发货'},
  {value:E_ORDER_STATUS.INBOUND, label:'入库'},
  {value:E_ORDER_STATUS.OUTBOUND, label:'出库'},
  {value:E_ORDER_STATUS.COMPLETED, label:'已完成'},
  {value:E_ORDER_STATUS.REJECTED, label:'客户拒绝收货'},
  {value:E_ORDER_STATUS.CANCEL, label:'已取消'},
]

// 报表类型
export const E_REPORT_TYPES = {
  SALES:'1', // 订单表
  GOODS:'2', // 商品销售表
  FOOTER:'3', // 鞋子尺码表
  STOCK:'4', // 进销存
  NEI_GUA:'5', // 内挂销售表
  CUSTOMER_BUY:'6', // 客户购买表
  CUSTOMER:'7', // vip客户表
}

export const Powers = [
  {
    id:MENU_IDS.reportTable,
    powers:[
      { id:POWER_TYPES.SALE_MANAGER, power:{view:true} },
      { id:POWER_TYPES.SHOP_MANAGER, power:{view:true} },
      { id:POWER_TYPES.SHOP_GUIDE, power:{view:false} },
      { id:POWER_TYPES.MANAGER_NORMAL, power:{view:true} },
      { id:POWER_TYPES.MANAGER_SENIOR, power:{view:true, add:true, edit:true} },
      { id:POWER_TYPES.FACTORY_PRODUCTION, power:{view:false} },
    ]
  },
  {
    id:MENU_IDS.salesItems,
    powers:[
      { id:POWER_TYPES.SALE_MANAGER, power:{view:true} },
      { id:POWER_TYPES.SHOP_MANAGER, power:{view:true} },
      { id:POWER_TYPES.SHOP_GUIDE, power:{view:false} },
      { id:POWER_TYPES.MANAGER_NORMAL, power:{view:true} },
      { id:POWER_TYPES.MANAGER_SENIOR, power:{view:true, add:true, edit:true} },
      { id:POWER_TYPES.FACTORY_PRODUCTION, power:{view:true} },
    ]
  },
  {
    id:MENU_IDS.salesOrder,
    powers:[
      { id:POWER_TYPES.SALE_MANAGER, power:{view:true} },
      { id:POWER_TYPES.SHOP_MANAGER, power:{view:true, add:true} },
      { id:POWER_TYPES.SHOP_GUIDE, power:{view:true, add:true} },
      { id:POWER_TYPES.MANAGER_NORMAL, power:{view:true} },
      { id:POWER_TYPES.MANAGER_SENIOR, power:{view:true, add:true, edit:true} },
      { id:POWER_TYPES.FACTORY_PRODUCTION, power:{view:true} },
    ]
  },
  {
    id:MENU_IDS.salesMaterial,
    powers:[
      { id:POWER_TYPES.SALE_MANAGER, power:{view:true} },
      { id:POWER_TYPES.SHOP_MANAGER, power:{view:true} },
      { id:POWER_TYPES.SHOP_GUIDE, power:{view:true} },
      { id:POWER_TYPES.MANAGER_NORMAL, power:{view:true} },
      { id:POWER_TYPES.MANAGER_SENIOR, power:{view:true, add:true, edit:true} },
      { id:POWER_TYPES.FACTORY_PRODUCTION, power:{view:true, add:true, edit:true} },
    ]
  },
  {
    id:MENU_IDS.salesSampleGoods,
    powers:[
      { id:POWER_TYPES.SALE_MANAGER, power:{view:true} },
      { id:POWER_TYPES.SHOP_MANAGER, power:{view:true} },
      { id:POWER_TYPES.SHOP_GUIDE, power:{view:true} },
      { id:POWER_TYPES.MANAGER_NORMAL, power:{view:true} },
      { id:POWER_TYPES.MANAGER_SENIOR, power:{view:true, add:true, edit:true} },
      { id:POWER_TYPES.FACTORY_PRODUCTION, power:{view:true} },
    ]
  },
  {
    id:MENU_IDS.salesItemsBase,
    powers:[
      { id:POWER_TYPES.SALE_MANAGER, power:{view:true, add:true, edit:true} },
      { id:POWER_TYPES.SHOP_MANAGER, power:{view:true, add:true, edit:true} },
      { id:POWER_TYPES.SHOP_GUIDE, power:{view:true} },
      { id:POWER_TYPES.MANAGER_NORMAL, power:{view:true} },
      { id:POWER_TYPES.MANAGER_SENIOR, power:{view:true, add:true, edit:true} },
      { id:POWER_TYPES.FACTORY_PRODUCTION, power:{view:true} },
    ]
  },

  {
    id:MENU_IDS.customerInfo,
    powers:[
      { id:POWER_TYPES.SALE_MANAGER, power:{view:true} },
      { id:POWER_TYPES.SHOP_MANAGER, power:{view:true} },
      { id:POWER_TYPES.SHOP_GUIDE, power:{view:true} },
      { id:POWER_TYPES.MANAGER_NORMAL, power:{view:true} },
      { id:POWER_TYPES.MANAGER_SENIOR, power:{view:true, add:true, edit:true} },
      { id:POWER_TYPES.FACTORY_PRODUCTION, power:{view:false} },
    ]
  },
  {
    id:MENU_IDS.customerBuy,
    powers:[
      { id:POWER_TYPES.SALE_MANAGER, power:{view:true} },
      { id:POWER_TYPES.SHOP_MANAGER, power:{view:true} },
      { id:POWER_TYPES.SHOP_GUIDE, power:{view:true} },
      { id:POWER_TYPES.MANAGER_NORMAL, power:{view:true} },
      { id:POWER_TYPES.MANAGER_SENIOR, power:{view:true, add:true, edit:true} },
      { id:POWER_TYPES.FACTORY_PRODUCTION, power:{view:false} },
    ]
  },

  {
    id:MENU_IDS.shopInfo,
    powers:[
      { id:POWER_TYPES.SALE_MANAGER, power:{view:true, add:true, edit:true} },
      { id:POWER_TYPES.SHOP_MANAGER, power:{view:true, add:true, edit:true} },
      { id:POWER_TYPES.SHOP_GUIDE, power:{view:true} },
      { id:POWER_TYPES.MANAGER_NORMAL, power:{view:true} },
      { id:POWER_TYPES.MANAGER_SENIOR, power:{view:true, add:true, edit:true} },
      { id:POWER_TYPES.FACTORY_PRODUCTION, power:{view:false} },
    ]
  },
  {
    id:MENU_IDS.shopGuide,
    powers:[
      { id:POWER_TYPES.SALE_MANAGER, power:{view:true, add:true, edit:true} },
      { id:POWER_TYPES.SHOP_MANAGER, power:{view:true, add:true, edit:true} },
      { id:POWER_TYPES.SHOP_GUIDE, power:{view:true} },
      { id:POWER_TYPES.MANAGER_NORMAL, power:{view:true} },
      { id:POWER_TYPES.MANAGER_SENIOR, power:{view:true, add:true, edit:true} },
      { id:POWER_TYPES.FACTORY_PRODUCTION, power:{view:false} },
    ]
  },

  {
    id:MENU_IDS.activityRecharge,
    powers:[
      { id:POWER_TYPES.SALE_MANAGER, power:{view:true} },
      { id:POWER_TYPES.SHOP_MANAGER, power:{view:true} },
      { id:POWER_TYPES.SHOP_GUIDE, power:{view:true} },
      { id:POWER_TYPES.MANAGER_NORMAL, power:{view:true} },
      { id:POWER_TYPES.MANAGER_SENIOR, power:{view:true, add:true, edit:true} },
    ]
  },
  {
    id:MENU_IDS.activityVIP,
    powers:[
      { id:POWER_TYPES.MANAGER_NORMAL, power:{view:true} },
      { id:POWER_TYPES.MANAGER_SENIOR, power:{view:true, add:true, edit:true} },
    ]
  },

  {
    id:MENU_IDS.systemSetting,
    powers:[
      { id:POWER_TYPES.MANAGER_SENIOR, power:{view:true, add:true, edit:true} },
    ]
  },
  {
    id:MENU_IDS.systemAdmin,
    powers:[]
  }
]

// 样品调拨状态
export const E_SAMPLE_ALLOT_STATUS = {
  REVIEW: 1, // 审核中
  REVIEW_FINISH:200, // 已审核等待发货
  TRANSPORT:300, // 发货中
  INBOUND:400, // 已入库
  COMPLETED: 500 // 已完成
};

// 样品调拨状态
export const SAMPLE_ALLOT_STATUS_DATAS = [
  {value:E_SAMPLE_ALLOT_STATUS.REVIEW, label:'等待审核'}, // 审核中
  {value:E_SAMPLE_ALLOT_STATUS.REVIEW_FINISH, label:'等待发货'}, // 已审核等待发货
  {value:E_SAMPLE_ALLOT_STATUS.TRANSPORT, label:'已发货'}, // 发货中
  {value:E_SAMPLE_ALLOT_STATUS.INBOUND, label:'已入库'}, // 已入库
  {value:E_SAMPLE_ALLOT_STATUS.COMPLETED, label:'完成'}, // 已完成
]
