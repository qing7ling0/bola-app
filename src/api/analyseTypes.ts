import * as graphqlTypes from './graphqlTypes'


export const analysePriceType = `{amount, count, sub_count, shop{_id,name,region_id}}`;
export const analyseGoodsType = `{NID, s_material, b_material, ws_material, amount, count}`;
export const analyseGoodsSalesType = `{top10Price, top10Count, allPrice, allCount}`
export const analyseGoodsMaterialType = `{NID, name, value, color}`
export const analyseGoodsSexType = `{name, value}`
export const analyseGoodsPriceType = `{price, value}`
export const analyseGoodsQuarterMaterialType = `{ s_material, b_material, ws_material, count}`;

