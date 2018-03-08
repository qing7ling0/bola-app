import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController, ToastController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import moment from 'moment'

import { OrderCustomerEditComponent } from '../../order-create/customer-edit/customer-edit.component';
import { FormValidator } from '../../../utils/form-validator'
import { CartListPage } from '../../cart-list/cart-list'
import { OrderCreatePage } from '../../order-create/order-create'
import { OrderTrackPage } from '../../order-track/order-track'
import { HeaderData } from '../../../interface/header-data';
import { AllotProvider, CommonProvider } from '../../../providers'
import { Utils } from '../../../utils/utils';
import * as graphqlTypes from '../../../api/graphqlTypes'
import * as constants from '../../../constants/constants'

const FORM_OPTIONS = (data)=> [
  {key:'NID', label:'货号', defaultValue:data&&data.NID||'', validators:[{key:'required', validator:Validators.required}]},
]

@Component({
  selector: 'page-sample-list',
  templateUrl: 'sample-list.html'
})
export class SampleListPage implements OnInit {
  headerData: HeaderData = {title:'样品调拨', menuEnable:false, type:'sample-list'};

  formOptions: Array<any>;
  formGroup: FormGroup;
  searchNID: string = '';
  sampleList: Array<any>;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private allotProvider: AllotProvider,
    private commonProvider: CommonProvider,
    public navParams: NavParams,
  ) {
  }

  ngOnInit(): void {
    this.formOptions = FORM_OPTIONS(null);
    
    this.formGroup = this.formBuilder.group(FormValidator.getFormBuildGroupOptions(this.formOptions));
  }

  ionViewDidLoad(): void {
    this.allotProvider.getSampleList().then((data:Array<any>) => {
      if (data) {
        this.sampleList = data;
      }
    })
  }

}
