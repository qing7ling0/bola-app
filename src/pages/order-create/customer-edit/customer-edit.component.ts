import { Component, Input, OnInit } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CustomerData } from '../../../interface/customer-data'
import { FormValidator } from '../../../utils/form-validator'
import { CustomerProvider, CommonProvider } from '../../../providers'

const FORM_OPTIONS = (data)=> [
  {key:'phone2', label:'手机号', defaultValue:data&&data.phone||'', validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/)}]},
  {key:'phone', label:'手机号', defaultValue:data&&data.phone||'', validators:[{key:'required', validator:Validators.required}, {key:'pattern', validator:Validators.pattern(/^((\+?86)|(\(\+86\)))?(13[012356789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/)}]},
  {key:'name', label:'姓名', defaultValue:data&&data.name||'', validators:[{key:'required', validator:Validators.required}]},
  {key:'sex', label:'性别', defaultValue:data&&data.sex||'', validators:[{key:'required', validator:Validators.required}]},
  {key:'birthday', label:'生日', defaultValue:data&&data.birthday||'', validators:[{key:'required', validator:Validators.required}]},
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
  customerProfile: CustomerData;
  @Input() onChange: Function;
  formOptions: Array<any>;
  sexDataList: Array<any>;
  vipLevelList: Array<any>;

  public customerGroup: FormGroup;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private customerProvider: CustomerProvider,
    private commonProvider: CommonProvider
  ) {
    this.customerProfile = null;
    this.sexDataList = [{label:'男', value:'男'}, {label:'女', value:'女'}];
    this.vipLevelList = [];
  }

  ngOnInit(): void {
    this.formOptions = FORM_OPTIONS(null);
    this.customerGroup = this.formBuilder.group(FormValidator.getFormBuildGroupOptions(this.formOptions));

    this.customerGroup.valueChanges.subscribe(data => {
      this.onChange && this.onChange(this.filterCustomerProperty(Object.assign({}, this.customerProfile||{}, data, {})));
    });
  }

  ionViewDidEnter(): void {
  }

  filterCustomerProperty(value) {
    if (value) {
      let ret = {};
      for(let key in value) {
        if (key.indexOf('editor_') === -1 && key !== 'label' && key !== 'value' && key !== 'phone2') {
          ret[key] = value[key];
        }
      }
      return ret;
    }

    return null;
  }

  onPhoneSureBtnClicked() {
    if (this.customerGroup.controls.phone2.valid) {
      this.customerProvider.getCustomerProfile(this.customerGroup.value.phone2).then((data) => {
        this.customerProfile = data;
        if (this.customerProfile) {
          // this.customerGroup.value = this.customerProfile;
          // this.customerGroup.controls.name.setValue(this.customerProfile.name);
          let value:any = {};
          for(let key in this.customerGroup.value) {
            value[key] = this.customerProfile[key];
          }
          if (value.birthday) {
            value.birthday = new Date(this.customerProfile.birthday).toISOString();
          }
          value.phone2 = this.customerProfile.phone;
          this.customerGroup.setValue(value);
        }
        if (this.onChange) {
          this.onChange(this.filterCustomerProperty(this.customerProfile));
        }
        this.commonProvider.getVipLevelList().then((data:Array<any>) => {
          if (data) {
            this.vipLevelList = data;
          }
        })
      })
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

  change() {
    console.log("change");
  }

  getCurrentDiscount() {
    if (this.customerProfile) {
      for(let lv of this.vipLevelList) {
        if (lv.level === this.customerProfile.vip_level) {
          return lv.discount+'折';
        }
      }
    }
    return '无';
  }

}
