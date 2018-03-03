import { AbstractControl } from '@angular/forms';

export class FormValidator {

  static getFormBuildGroupOptions(options: Array<any>) {
    let ret = {};
    options.forEach((item)=> {
      let validators = item.validators.map((va)=> {
        return va.validator;
      })
      ret[item.key] = [item.defaultValue, validators];
    })

    return ret;
  }

  static getValidError(fromControls: {[key: string]: AbstractControl}, options: Array<any>) {
    for(let op of options) {
      let ctrl = fromControls[op.key];
      if (ctrl) {
        for(let va of op.validators) {
          if (ctrl.hasError(va.key)) {
            return va.message || FormValidator.getError(va.key, op.label);
          }
        }
      }
    }

    return '';
  }

  static getError(validType: string, label: string) {
    if (validType === 'required') {
      return `请填写${label}`;
    } else {
      return `${label}格式不合法`
    }
  }
}