import { Component, Input, forwardRef, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Select } from 'ionic-angular';

import * as constants from '../../constants/constants';

const noop = () => {
};

export const BOLA_SELECT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => InputSelectComponent),
  multi: true
};

@Component({
  selector: 'bola-input-select',
  template: `
  <div class="bola-input-select">
    <ion-input [type]="text" [placeholder]="placeholder" [(ngModel)]="_value" (ngModelChange)="onChange()"></ion-input>
    <div class="bola-input-select search" (click)="search()"><ion-icon name="search" class="icon"></ion-icon></div>
    <ion-select #mySelect class="bola-select" [(ngModel)]="_value" (ngModelChange)="onChange && onChange()" okText="确定" cancelText="取消">
      <ion-option *ngFor="let data of source" value="{{data.value}}">{{data.label}}</ion-option>
    </ion-select>
  </div>`,
  providers: [ BOLA_SELECT_VALUE_ACCESSOR ]
})

export class InputSelectComponent implements ControlValueAccessor {
  @Input() source: Array<any>;
  @Input() placeholder: string;
  @Input() onChanged: () => void = noop;
  @Input() canInput: boolean = true;

  @ViewChild('mySelect') mySelect: Select

  private _onTouchedCallback: () => void = noop;
  private _onChangeCallback: (_: any) => void = noop;

  private _value: any = '';

  search = (): void => {
    this.mySelect.open();
  }

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
