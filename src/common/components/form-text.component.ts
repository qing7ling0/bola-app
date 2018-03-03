import { Component, Input, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import moment from 'moment'

import * as constants from '../../constants/constants';

const noop = () => {
};

export const BOLA_SELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FormTextComponent),
  multi: true
};

@Component({
  selector: 'bola-form-text',
  template: `<p>{{formatValue()}}</p>`,
  providers: [ BOLA_SELECT_VALUE_ACCESSOR ]
})

export class FormTextComponent implements ControlValueAccessor {
  @Input() source: Array<any>;
  @Input() placeholder: string;
  @Input() onChanged: () => void = noop;
  @Input() isDate: boolean = false;
  @Input() dateFormat: "";

  private _onTouchedCallback: () => void = noop;
  private _onChangeCallback: (_: any) => void = noop;

  private _value: any = '';

  writeValue(obj: any): void {
    this._value = obj;
    console.log('writeValue' + obj);
    this._onChangeCallback(this._value);
  }

  registerOnChange(fn: any): void {
    this._onChangeCallback = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouchedCallback = fn;
  }

  onChange() : void {
    this._onChangeCallback(this._value);
    this.onChanged();
  }

  formatValue() {
    if (this.isDate && this.dateFormat) {
      return moment(this._value).format(this.dateFormat);
    }

    return this._value;
  }
}
