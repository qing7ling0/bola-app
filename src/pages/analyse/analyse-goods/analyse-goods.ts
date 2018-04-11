/**
 * 店铺排名
 */

import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { NavController, ToastController, NavParams, ModalController, Events, } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Storage } from '@ionic/storage';
import moment from 'moment'

import { OrderCustomerEditComponent } from '../../order-create/customer-edit/customer-edit.component';
import { FormValidator } from '../../../utils/form-validator'
import { HeaderData } from '../../../interface/header-data';
import { CommonProvider, AnalyseProvider } from '../../../providers'
import { Utils } from '../../../utils/utils';
import * as graphqlTypes from '../../../api/graphqlTypes'
import * as constants from '../../../constants/constants'

declare var echarts;

const E_DATE_TYPES = {
  DAY:1,
  WEEK:2,
  MONTH:3,
  YEAR:4
}

@Component({
  selector: 'page-analyse-goods',
  templateUrl: 'analyse-goods.html'
})
export class AnalyseGoodsPage implements OnInit {
  @ViewChild('analyseGoodsTop10') goodsTop10Element: ElementRef;
  @ViewChild('analyseGoodsMatrial') goodsMatrialElement: ElementRef;
  @ViewChild('analyseGoodsQuarterMatrial') goodsQuarterMatrialElement: ElementRef;
  @ViewChild('analyseGoodsSex') goodsSexElement: ElementRef;
  @ViewChild('analyseGoodsQuarterSex') goodsQuarterSexElement: ElementRef;
  @ViewChild('analyseGoodsPrice') goodsPriceElement: ElementRef;
  @ViewChild('analyseGoodsQuarterPrice') goodsQuarterPriceElement: ElementRef;

  formOptions: Array<any>;
  formGroup: FormGroup;
  searchNID: string = '';
  analyseListPage: any = {page:0,pageSize:0,total:0}
  loginUserId: string = '';
  loginUserShopId: string = '';
  isShopManager: Boolean = false;
  user: any = null;
  chart: any = null;
  currentDateType: Number = E_DATE_TYPES.DAY;

  top10List: Array<any> = []; // 销量Top10
  top10SalesPerList:Array<any> = []; // 销量top10占比
  materialList: Array<any> = []; // 销量材质
  salesSexList: Array<any> = []; // 销量男女
  priceList: Array<any> = []; // 价格分段
  quarterMaterialList: Array<any> = []; // 季度材质分布
  quarterSexList: Array<any> = []; // 季度男女分布
  quarterPriceList: Array<any> = []; // 季度价格分段分布
  top10AmountPer:string = '0%';
  top10CountPer:string = '0%';

  @Input() onLoadSuccess: Function;

  constructor(
    public navCtrl: NavController,
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private commonProvider: CommonProvider,
    private analyseProvider: AnalyseProvider,
    private storage: Storage,
    public navParams: NavParams,
    private events: Events
  ) {
    this.user = navParams.get('user');
    if (this.user) {
      this.loginUserId = this.user._id;
      if (this.user.shop) {
        this.loginUserShopId = this.user.shop._id;
      }
      this.isShopManager = this.user.manager;
    }
  }

  ngOnInit(): void {
    // this.commonProvider.getCommonDataList('shopRegionList', constants.E_COMMON_DATA_TYPES.SHOP_REGION, graphqlTypes.regionType).then((result)=>{
    //   if (result) {
    //     this.onReqList();
    //   }
    // });
    // this.initChartsTop10();
  }

  ionViewDidEnter(): void {
  }

  initChartsTop10(): void {
    let ctx = this.goodsTop10Element.nativeElement;
    this.chart = echarts.init(ctx);
    let top10PerDatas = [100, 15, 200, 44]

    let top10List = [0.5,0.5];
    let otherList = [0.5,0.5];
    if (top10PerDatas[2]) {
      top10List[0] = top10PerDatas[0] / top10PerDatas[2];
      otherList[0] = 1 - top10List[0];
    }
    if (top10PerDatas[3]) {
      top10List[1] = top10PerDatas[1] / top10PerDatas[3];
      otherList[1] = 1 - top10List[1];
    }

    this.top10AmountPer = new Number(top10List[0]*100).toFixed(2);
    this.top10CountPer = new Number(top10List[1]*100).toFixed(2);

    this.chart.setOption({
      legend: {
        data: ['畅销','其他']
      },
      xAxis:  {
        type: 'value',
        show: false
      },
      yAxis: {
        type: 'category',
        data: ['销售','销量']
      },
      series : [
        {
          name:'畅销',
          type:'bar',
          stack: '总量',
          data:top10List,
          label: {
            show:true,
            color:"#4D4736",
            formatter:(params)=>{
              return top10PerDatas[params.dataIndex]
            }
          }
        },
        {
          name:'其他',
          type:'bar',
          stack: '总量',
          data:otherList,
          label: {
            show:true,
            color:"#ffffff",
            formatter:(params)=>{
              return top10PerDatas[params.dataIndex+2]-top10PerDatas[params.dataIndex]
            }
          }
        }
      ],
      color:["#C0A64F", "#323232"]
    });
  }

  initChartsMaterial(): void {
    let ctx = this.goodsMatrialElement.nativeElement;
    this.materialList = [
      {
        NID:'',
        name:'材质一',
        color:'#ff0000',
        value:100,
      },
      {
        NID:'',
        name:'材质2',
        color:'#ff00ff',
        value:200
      },
    ];
    for(let i=0; i<20; i++) {
      this.materialList.push({
        name:'材质'+(i+1),
        value:i*100+100,
        color:'#ff00ff'
      })
    }
    this.chart = echarts.init(ctx);
    this.chart.setOption({
      legend: {
        type: 'scroll',
        orient: 'horizontal',
        show:true,
        right: 10,
        left: 10,
        bottom: 20,
        data: this.materialList.map(item=>item.name),
        selectedMode:false
      },
      series : [
        {
          name:'材质分布图',
          type:'pie',
          radius :'55%',
          center: ['50%', '35%'],
          data:this.materialList,
          label: {
            show:true
          }
        }
      ],
      color:this.materialList.map(item=>item.color)
    });
  }

  initChartsQuarterMaterial(): void {
    let ctx = this.goodsQuarterMatrialElement.nativeElement;
    this.quarterMaterialList = [
      {
        NID:'',
        name:'材质一',
        color:'#ff0000',
        value:[100, 200, 239, 490],
      },
      {
        NID:'',
        name:'材质2',
        color:'#ff00ff',
        value:[130, 100, 139, 590],
      },
    ];
    this.chart = echarts.init(ctx);
    this.chart.setOption({
      legend: {
        type: 'plain',
        orient: 'horizontal',
        show:false,
        right: 10,
        left: 10,
        bottom: 20,
        data: this.quarterMaterialList.map(item=>item.name),
        selectedMode:false
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis:  {
        type: 'category',
        data: ['第一季度','第二季度','第三季度','第四季度']
      },
      yAxis: {
        type: 'value',
        show:false,
      },
      series : this.quarterMaterialList.map((item)=>{
        return {
          name:item.name,
          type: 'bar',
          stack: '总量',
          data:item.value,
          label: {
            show:true
          }
        }
      }),
    });
  }

  initChartsSex(): void {
    let ctx = this.goodsSexElement.nativeElement;
    this.salesSexList = [
      {
        name:'男',
        color:'#2980D9',
        value:100,
      },
      {
        name:'女',
        color:'#EB4986',
        value:200
      },
    ];
    this.chart = echarts.init(ctx);
    this.chart.setOption({
      legend: {
        type: 'plain',
        orient: 'horizontal',
        show:true,
        right: 10,
        left: 10,
        bottom: 20,
        data: this.salesSexList.map(item=>item.name),
        selectedMode:false
      },
      series : [
        {
          name:'男女分布图',
          type:'pie',
          radius :'55%',
          center: ['50%', '35%'],
          data:this.salesSexList,
          label: {
            show:true
          }
        }
      ],
      color:this.salesSexList.map(item=>item.color)
    });
  }

  initChartsQuarterSex(): void {
    let ctx = this.goodsQuarterSexElement.nativeElement;
    this.quarterSexList = [
      {
        NID:'',
        name:'男',
        color:'#ff0000',
        value:[100, 200, 239, 490],
      },
      {
        NID:'',
        name:'女',
        color:'#ff00ff',
        value:[130, 100, 139, 590],
      },
    ];
    this.chart = echarts.init(ctx);
    this.chart.setOption({
      legend: {
        type: 'plain',
        orient: 'horizontal',
        show:false,
        right: 10,
        left: 10,
        bottom: 20,
        data: this.quarterSexList.map(item=>item.name),
        selectedMode:false
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis:  {
        type: 'category',
        data: ['第一季度','第二季度','第三季度','第四季度']
      },
      yAxis: {
        type: 'value',
        show:false,
      },
      series : this.quarterSexList.map((item)=>{
        return {
          name:item.name,
          type: 'bar',
          stack: '总量',
          data:item.value,
          label: {
            show:true
          }
        }
      }),
    });
  }

  initChartsPrices(): void {
    this.priceList = [
      {
        price:1999,
        value:100
      },
      {
        price:2999,
        value:200
      },
      {
        price:3999,
        value:500
      },
    ]
    let names = this.priceList.map(item => item.price);
    let ctx = this.goodsPriceElement.nativeElement;
    this.chart = echarts.init(ctx);
    this.chart.setOption({
      xAxis: {
        type: 'category',
        data: this.priceList.map(item => item.price)
      },
      yAxis: {
        type: 'value',
        show: false
      },
      series: [
        {
          data: this.priceList.map(item => item.value),
          type: 'bar',
          itemStyle: {
            color:'#dc5569'
          }
        }
      ]
    });
  }

  initChartsQuarterPrice(): void {
    let ctx = this.goodsQuarterPriceElement.nativeElement;
    this.quarterPriceList = [
      {
        price:1000,
        color:'#ff0000',
        value:[100, 200, 239, 490],
      },
      {
        price:2000,
        color:'#ff00ff',
        value:[130, 100, 139, 590],
      },
      {
        price:3000,
        color:'#0000ff',
        value:[130, 100, 139, 590],
      },
    ];
    this.chart = echarts.init(ctx);
    this.chart.setOption({
      legend: {
        type: 'plain',
        orient: 'horizontal',
        show:false,
        right: 10,
        left: 10,
        bottom: 20,
        data: this.quarterPriceList.map(item=>item.name),
        selectedMode:false
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis:  {
        type: 'category',
        data: this.quarterPriceList.map(item=>item.price)
      },
      yAxis: {
        type: 'value',
        show:false,
      },
      series : this.quarterPriceList.map((item)=>{
        return {
          name:item.name,
          type: 'bar',
          stack: '总量',
          data:item.value,
          label: {
            show:true
          }
        }
      }),
    });
  }

  reqRefresh(dateType:number) {
    this.currentDateType = dateType;
    this.onReqList();
  }

  int2CssColor(value: Number) {
    let color = `000000${new Number(value).toString(16)}`;
    color = color.substr(color.length-6, 6);
    return '#'+color;
  }

  onRefresh() {
    // for(let re of this.regionList) {
    //   regionShops[re._id] = [];
    // }
    // this.shopList.forEach((item)=>{
    //   if (item.shop && item.shop.region_id) {
    //     if (regionShops[item.shop.region_id]){
    //       regionShops[item.shop.region_id].push(item);
    //     }
    //   }
    // })

    // let regions = [];
    // let analyseMaxCount = 9;
    // for(let reId in regionShops) {
    //   let region = this.findRegion(reId);
    //   let shop = regionShops[reId];
    //   if (region) {
    //     let item = {
    //       name:region.name,
    //       color:this.int2CssColor(region.color_css),
    //       amount:shop.reduce((pre,cur,index,arr)=>{
    //         return {amount:pre.amount+cur.amount}
    //       }, {amount:0}).amount,
    //       count:shop.reduce((pre,cur,index,arr)=>{
    //         return {count:pre.count+cur.count}
    //       }, {count:0}).count,
    //       sub_count:shop.reduce((pre,cur,index,arr)=>{
    //         return {sub_count:pre.sub_count+cur.sub_count}
    //       }, {sub_count:0}).sub_count,
    //     };
    //     regions.push(item)
    //     // if (regions.length > analyseMaxCount) {
    //     //   regions[analyseMaxCount].amount += item.amount;
    //     //   regions[analyseMaxCount].count += item.amount;
    //     //   regions[analyseMaxCount].sub_count += item.sub_count;
    //     // } else {
    //     //   if (regions.length === analyseMaxCount) {
    //     //     item.name = '其他';
    //     //   }
    //     //   regions.push(item)
    //     // }
    //   }
    // }
    // regions.sort((a,b)=>a.amount>b.amount?-1:1);

    // this.chartEachList.price = [];
    // this.chartEachList.count = [];
    // for(let i=0; i<regions.length; i++) {
    //   let region = regions[i];
    //   if (i > analyseMaxCount) {
    //     this.chartAmountList[analyseMaxCount].value += region.amount;
    //   } else {
    //     this.chartAmountList.push({name:i===analyseMaxCount?'其他':region.name, color:region.color, value:region.amount});
    //   }

    //   if (i < analyseMaxCount) {
    //     this.chartEachList.price.push({name:region.name, color:region.color, value:Math.floor(region.count===0?0:(region.amount/region.count))})
    //     this.chartEachList.count.push({name:region.name, color:region.color, value:Math.floor(region.count===0?0:(region.sub_count*10/region.count))/10})
    //   }
    // }

    // this.chartAmountList = this.chartAmountList.map(item=>{
    //   item.value = item.value);
    //   return item;
    // })

    // console.log("analyse-shop onRefresh" + JSON.stringify(this.chartAmountList));
    // this.chartAmountList.sort((a,b)=>a.amount>b.amount?-1:1);
    this.initChartsTop10();
    this.initChartsMaterial();
    this.initChartsSex();
    switch(this.currentDateType) {
      case E_DATE_TYPES.DAY:
      break;
      case E_DATE_TYPES.WEEK:
      break;
      case E_DATE_TYPES.MONTH:
      this.initChartsPrices();
      break;
      case E_DATE_TYPES.YEAR:
      this.initChartsQuarterMaterial();
      this.initChartsQuarterSex();
      this.initChartsQuarterPrice();
      break;
      default:
      break;
    }
  }

  onReqList() {
    switch(this.currentDateType) {
      case E_DATE_TYPES.DAY:
        this.analyseProvider.getShopAnalyseDayList(this.currentDateType).then((result)=>{
          if (result) {
            this.top10List = result.analyseGoodsTop10;
            this.top10SalesPerList = result.analyseGoodsSalesPer;
            this.materialList = result.analyseGoodsMaterial;
            this.salesSexList = result.analyseGoodsSex;
            this.onRefresh();
          }
        })
      break;
      case E_DATE_TYPES.WEEK:
        this.analyseProvider.getShopAnalyseWeekList(this.currentDateType).then((result)=>{
          if (result) {
            this.top10List = result.analyseGoodsTop10;
            this.top10SalesPerList = result.analyseGoodsSalesPer;
            this.materialList = result.analyseGoodsMaterial;
            this.salesSexList = result.analyseGoodsSex;
            this.onRefresh();
          }
        })
      break;
      case E_DATE_TYPES.MONTH:
        this.analyseProvider.getShopAnalyseMonthList(this.currentDateType).then((result)=>{
          if (result) {
            this.top10List = result.analyseGoodsTop10;
            this.top10SalesPerList = result.analyseGoodsSalesPer;
            this.materialList = result.analyseGoodsMaterial;
            this.salesSexList = result.analyseGoodsSex;
            this.priceList = result.analyseGoodsPrice;
            this.onRefresh();
          }
        })
      break;
      case E_DATE_TYPES.YEAR:
        this.analyseProvider.getShopAnalyseYearList(this.currentDateType).then((result)=>{
          if (result) {
            this.top10List = result.analyseGoodsTop10;
            this.top10SalesPerList = result.analyseGoodsSalesPer;
            this.materialList = result.analyseGoodsMaterial;
            this.salesSexList = result.analyseGoodsSex;
            this.quarterMaterialList = result.analyseGoodsMaterialList4Quarter;
            this.quarterSexList = result.analyseGoodsSexList4Quarter;
            this.quarterPriceList = result.analyseGoodsPriceList4Quarter;
            this.onRefresh();
          }
        })
      break;
      default:
      // this.analyseProvider.getShopAnalyseDayList(this.currentDateType).then((result)=>{
      //   if (result) {
      //     this.shopList = result.analyseShopList;
      //     this.onRefresh();
      //   }
      // })
      break;
    }
  }

  subscribeEvents() {
  }

  priceFormat(value:number, fristDigits:number=1) {
    if (value < 9000) {
      return new Number(value).toFixed(fristDigits);
    } else if (value < 90000000) {
      return new Number(value/10000).toFixed(2)+'万';
    } else {
      return new Number(value/100000000).toFixed(2)+'亿';
    }
  }

}
