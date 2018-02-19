import { Component, Input, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import * as constants from '../../constants/constants';

const noop = () => {
};

export const BOLA_SELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectComponent),
  multi: true
};

@Component({
  selector: 'bola-select',
  template: `
  <ion-select class="bola-select" [(ngModel)]="_value" [placeholder]="placeholder" (ngModelChange)="onChange && onChange()" okText="确定" cancelText="取消">
    <ion-option *ngFor="let data of source" value="{{data.value}}">{{data.label}}</ion-option>
  </ion-select>`,
  providers: [ BOLA_SELECT_VALUE_ACCESSOR ]
})

export class SelectComponent implements ControlValueAccessor {
  @Input() source: Array<any>;
  @Input() placeholder: string;
  @Input() onChanged: () => void = noop;

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
}
