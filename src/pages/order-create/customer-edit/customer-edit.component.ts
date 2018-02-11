import { Component, Input, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CustomerData } from '../../../interface/customer-data'

@Component({
  selector: 'order-customer-edit',
  templateUrl: 'customer-edit.html'
})
export class OrderCustomerEditComponent implements OnInit {
  @Input() customerData: CustomerData;
  customerGroup: FormGroup;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.customerGroup = this.formBuilder.group({
      phone: ['', [Validators.required]],
      name: ['', [Validators.required]],
      weixin: ['', [Validators.required]],
      
      country: [''],
      city: [''],
      address: [''],
      zipcode: [''],
    });
  }

  onPhoneSureBtnClicked() {
    
  }

  onNavClicked(nav: object) : void {
  }

}
