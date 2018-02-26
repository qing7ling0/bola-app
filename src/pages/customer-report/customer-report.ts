import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CartListPage } from '../cart-list/cart-list'
import { OrderCreatePage } from '../order-create/order-create'
import { OrderTrackPage } from '../order-track/order-track'
import {HeaderData} from '../../interface/header-data';

@Component({
  selector: 'page-customer-report',
  templateUrl: 'customer-report.html'
})
export class CustomerReportPage {
  headerData: HeaderData = {title:'会员管理', menuEnable:false, type:'customer'};
  sexDataList:Array<any> = [{value:'1', label:'test1'},{value:'2', label:'test2'}];
  vipTagList:Array<any> = [{value:'1', label:'土豪'}, {value:'2', label:'土豪2'}];

  constructor(public navCtrl: NavController) {
  }

  onNavClicked(nav: any) : void {
    switch(nav.id) {
      case 'create':
      this.navCtrl.push(OrderCreatePage);
      break;
      case 'cart':
      this.navCtrl.push(CartListPage);
      break;
      case 'track':
      this.navCtrl.push(OrderTrackPage);
      break;
    }
  }

}
