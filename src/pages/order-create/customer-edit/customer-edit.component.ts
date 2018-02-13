import { Component, Input, OnInit } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CustomerData } from '../../../interface/customer-data'
import { FormValidator } from '../../../utils/form-validator'

const FORM_OPTIONS = (data)=> [
  {key:'phone2', label:'手机号', defaultValue:data&&data.phone||'', validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/)}]},
  {key:'phone', label:'手机号', defaultValue:data&&data.phone||'', validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/)}]},
  {key:'name', label:'姓名', defaultValue:data&&data.name||'', validators:[{key:'required', validator:Validators.required}]},
  {key:'weixin', label:'微信号', defaultValue:data&&data.weixin||'', validators:[{key:'required', validator:Validators.required}]},

  {key:'country', label:'国家', defaultValue:data&&data.country||'', validators:[]},
  {key:'city', label:'城市', defaultValue:data&&data.city||'', validators:[]},
  {key:'address', label:'地址', defaultValue:data&&data.address||'', validators:[]},
  {key:'zipcode', label:'邮编', defaultValue:data&&data.zipcode||'', validators:[]},
]

@Component({
  selector: 'order-customer-edit',
  templateUrl: 'customer-edit.html'
})
export class OrderCustomerEditComponent implements OnInit {
  customerData: CustomerData;
  @Input() onChange: Function;
  customerGroup: FormGroup;
  formOptions: Array<any>

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController
  ) {}

  ngOnInit(): void {
    this.formOptions = FORM_OPTIONS(null);
    this.customerGroup = this.formBuilder.group(FormValidator.getFormBuildGroupOptions(this.formOptions));
  }

  onPhoneSureBtnClicked() {
    if (this.onChange) {
      this.onChange(this);
    }
  }

  submit() {
    if (!this.customerGroup.valid) {
      let message = FormValidator.getValidError(this.customerGroup.controls, this.formOptions);
      if (message) {
        this.toastCtrl.create({
          message:message,
          duration:1500,
          position:'middle'
        }).present();
      }
      return null;
    }

    return this.customerGroup.value;
  }

  onNavClicked(nav: object) : void {

  }

}
