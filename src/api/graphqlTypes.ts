export const userType = `
{
  ... on userShopGuide {
    _id,
    name,
    manager,
    sex,
    shop {
      _id, name
    },
    birthday,
    height,
    weight,
    entry_time,
    leave_time,
    editor_name,
    editor_time,
    user_type,
    account {
      _id,
      account
    }
  }
  ... on userOperate {
    _id,
    name,
    sex,
    user_type,
    editor_name,
    editor_time,
    account {
      _id,
      account
    }
  }
  ... on userProduction {
    _id,
    name,
    sex,
    step,
    user_type,
    editor_name,
    editor_time,
    account {
      _id,
      account
    }
  }
  ... on userAdmin {
    _id,
    name,
    sex,
    user_type,
    editor_name,
    editor_time,
    account {
      _id,
      account
    }
  }
}`

export const shopType = `{
  _id,
  name,
  open_date,
  rents_expire_date,
  rent,
  area,
  country,
  region,
  province,
  marketLevel,
  property,
  phone,
  address,
  zipcode,
  close_date,
  close_reason,
  editor_name,
  editor_time,
}`

export const customerType = `{
  _id,name,phone,sex,birthday,weixin,weixin_code_pic,country,city,address,zipcode,
  vip_card_date,vip_card_shop{_id, name},vip_card_guide{_id,name},vip_level,vip_exp,balance,join_type,
}`

export const rechargeType = `{_id, mount, reward}`
export const vipLevelType = `{_id, level, exp, discount}`

export const materialType = `{_id, name, NID, color{_id,name}, count}`
export const salesBaseType = `{_id, name, NID, editor_name, editor_time}`
export const colorType = `{_id, name, NID, editor_name, editor_time}`
export const maintainType = `{_id, name, NID, price, time, editor_name, editor_time}`
export const customType = `{_id, name, NID, price, editor_name, editor_time}`
export const urgentType = `{_id, NID, day, price, editor_name, editor_time}`
export const xuanHaoType = `{_id, NID, name, editor_name, editor_time}`
export const guiGeType = `{_id, NID, name, editor_name, editor_time}`
export const genGaoType = `{_id, NID, name, editor_name, editor_time}`
export const watchStrapStyleType = `{_id, NID, name, editor_name, editor_time}`
export const shoesTieBianType = `{_id, NID, name, editor_name, editor_time}`
export const footType = `{_id, type, size, length, zhiWei, fuWei}`

const goodsBaseType =`_id, NID, name, goods, put_date, sex, price, maintain_cycle,type { _id, name }, style { _id, name }, season { _id, name }, pics,editor_name,editor_time`
const goodsShoesType = `s_material{_id,name}, s_xuan_hao{_id,name}, s_gui_ge{_id,name}, s_gen_gao{_id,name}, s_out_color{_id,name}, s_in_color{_id,name}, s_bottom_color{_id,name}, s_bottom_side_color{_id,name}`
const goodsBeltType = `b_material{_id,name}, b_color{_id,name}`
const goodsWatchStrapType = `ws_material{_id,name}, ws_style{_id,name}`
const goodsOrnamentType = ``
export const goodsType=`{${goodsBaseType}, ${goodsShoesType}, ${goodsBeltType}, ${goodsWatchStrapType}, ${goodsOrnamentType}}`



export const orderBaseFields = `
  _id,
  type,
  source,
  count,
  pay,
  pay_type,
  order_state,
  transport_company,
  transport_id,
  transport_price,
  transport_name,
  transport_phone,
  transport_address,
  transport_zipcode,
  remark
`
export const orderShoseType = `{
  ${orderBaseFields},
  shop{_id, name},
  guide{_id, name},
  customer{_id, name},
  goods{_id, name},
  xieXuan,
  xieGen,
  foot_size,
  left_length,
  left_zhiWei,
  left_fuWei,
  right_length,
  right_zhiWei,
  right_fuWei,
}
`

export const orderBeltType = `{
  ${orderBaseFields},
  shop {_id, name},
}
`
export const orderWatchStrapType = `{
  ${orderBaseFields},
  shop {_id, name},
}
`
export const orderTypes ={
  orderShoes:orderShoseType,
  orderBelt:orderBeltType,
  orderWatchStrap:orderWatchStrapType
}

export const customerReportType = `{customer {_id,name,phone,sex,birthday}, lastCostTime, costCount, costAmount}`
export const customerReportBaseType = `{totalCount, monthCount, yearCount, notBuyCount}`

export const pageListType = (itemType) =>{
  return`{page {page,pageSize,total} list ${itemType}}`
}

export const resultType = `
  {n,ok}
`
