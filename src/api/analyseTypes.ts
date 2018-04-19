import * as graphqlTypes from './graphqlTypes'


export const analysePriceType = `{amount, count, sub_count, shop{_id,name,region_id}}`;
export const analyseGoodsType = `{NID, s_material, b_material, ws_material, amount, count}`;
export const analyseGoodsMaterialType = `{_id, value}`
export const analyseGoodsSexType = `{name, value, color}`
export const analyseGoodsPriceType = `{price, value}`
export const analyseGoodsQuarterMaterialType = `{ s_material, b_material, ws_material, count}`;

const repeatBuyPerType = `{all_count, old_count, current_count, last_count, last_all_count}`
const repeatBuyCountType = `{current_all_count, current, last_all_count, last, highest}`
const vaildVipType = `{all_count, vaild_count}`
const baseAnalyseType = `{name, value}`

export const analyseVipShopType = `{ shop{_id,name}, count, total_count }`
export const analyseVipDayType = `{ newAndOldAmount, countAndAmountPer }`
export const analyseVipWeekType = `{ newAndOldAmount, countAndAmountPer, repeatBuyPer${repeatBuyPerType} }`
export const analyseVipMonthType = `{ newAndOldAmount, countAndAmountPer, repeatBuyPer${repeatBuyPerType}, vaildVip${vaildVipType}, monthBuyCountList }`
export const analyseVipYearType = `{ newAndOldAmount, countAndAmountPer, repeatBuyPer${repeatBuyPerType}, repeatBuyCount${repeatBuyCountType}, vaildVip${vaildVipType}, buyCount${baseAnalyseType}, quarterBuyCountList }`

