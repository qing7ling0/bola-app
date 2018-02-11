import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {HeaderData} from '../../../interface/header-data';

@Component({
  selector: 'page-order-create-shoes',
  templateUrl: 'shoes.html'
})
export class OrderShoesPage {
  headerData: HeaderData = {title:'订单创建', menuEnable:false};

  constructor(public navCtrl: NavController) {

  }

  onNavClicked(nav: object) : void {
  }

}
