/**
 * 是否是数字
 * @param value
 * @returns {boolean}
 * @constructor
 */
export const IsNumber = function(value) {
  var numb = /d/;
  return numb.test(value);
};


/**
* 是否是电话号码
* @param value
* @returns {*|boolean}
*/
export const isTel = function(value){
  var tel = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
  return tel.test(value);
};

/**
* 是否是手机号码
* @param value
* @returns {*|boolean}
*/
export const isMobile = function(value){
  var mob=/^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/;
  return mob.test(value);
};

/**
* 是否是身份证号码
* @param value
* @returns {*|boolean}
*/
export const isCardID = function(value) {
  var card = /(^\d{15}$)|(^\d{17}([0-9]|X)$)/;
  return card.test(value);
};


/**
* 是否是邮箱
* @param value
* @returns {*|boolean}
*/
export const isEmail = function(value) {
  var email = /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/;
  return email.test(value);
};

/**
 * 是否有中文
 * @param  value 
* @returns {*|boolean}
 */
export const isHasChinese = function(value) {
  var test = /[\u4E00-\u9FA5]/
  return test.test(value)
}