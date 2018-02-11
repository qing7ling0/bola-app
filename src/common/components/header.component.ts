import { Component, Input } from '@angular/core';
import { NavController, Events, ToastController } from 'ionic-angular';
import { FormBuilder, FormControl, FormGroup, Validators, NgForm } from '@angular/forms';

import {HeaderData} from '../../interface/header-data';

import * as constants from '../../constants/constants'

@Component({
  selector: 'header',
  templateUrl: 'header.html'
})
export class HeaderComponent {
  // @Input() title: string;
  @Input() headerData: HeaderData;

  constructor(
    public events: Events,
    public navCtrl: NavController,
    private toastCtrl: ToastController
  ) {
    this.subscribeEvents();
  }

  back() : void {
    this.navCtrl.pop();
  }

  subscribeEvents() {
  }

}
