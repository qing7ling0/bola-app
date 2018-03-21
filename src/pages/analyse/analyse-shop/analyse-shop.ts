/**
 * 店铺排名
 */

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  selector: 'page-analyse-shop',
  templateUrl: 'analyse-shop.html'
})
export class AnalyseShopPage implements OnInit {
  headerData: HeaderData = {title:'数据分析', menuEnable:false, type:'analyse-shop'};

  @ViewChild('analyseDayAmount') dayAmountElement: ElementRef;
  @ViewChild('analyseDayEach') dayEachElement: ElementRef;
  @ViewChild('analyseWeekSales') weekSalesElement: ElementRef;
  @ViewChild('analyseMonthSales') monthSalesElement: ElementRef;
  @ViewChild('analyseMonthSalesCompare') monthSalesCompareElement: ElementRef;
  @ViewChild('analyseQuarterAmount') quarterAmountElement: ElementRef;

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
  regionList: Array<any>;
  shopList: Array<any> = [];
  chartAmountList: Array<any> = []; // 总销售额
  chartEachList: any = {
    price:[],
    count:[]
  }; // 客单价/客单件

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
    // this.formOptions = FORM_OPTIONS(null);
    // this.formGroup = this.formBuilder.group(FormValidator.getFormBuildGroupOptions(this.formOptions));
  }

  ionViewDidEnter(): void {
    this.commonProvider.getCommonDataList('shopRegionList', constants.E_COMMON_DATA_TYPES.SHOP_REGION, graphqlTypes.regionType).then((result)=>{
      if (result) {
        this.regionList = result;
        this.onReqList();
      }
    });
    // this.initChartsDayAmount();
    // this.initChartsDayEach();
    // this.initChartsWeekSales();
    // this.initChartsMonthSales();
    // this.initChartsMonthSalesCompare();
    // this.initChartsQuarterAmount();
  }

  initChartsDayAmount(): void {
    let ctx = this.dayAmountElement.nativeElement;
    this.chart = echarts.init(ctx);
    this.chart.setOption({
      tooltip : {
        trigger: 'item'
      },
      legend: {
        type: 'plain',
        orient: 'horizontal',
        show:true,
        right: 10,
        left: 10,
        bottom: 20,
        data: this.chartAmountList.map(item=>item.name),
        selectedMode:false
      },
      series : [
        {
          name:'直接访问',
          type:'pie',
          radius : ['30%', '55%'],
          center: ['50%', '35%'],
          data:this.chartAmountList,
          label: {
            show:true,
            formatter: '{c}'
          }
        }
      ],
      color:this.chartAmountList.map(item=>item.color)
    });
  }

  initChartsDayEach(): void {
    let ctx = this.dayEachElement.nativeElement;
    this.chart = echarts.init(ctx);
    this.chart.setOption({
      xAxis: [
        {
          type: 'category',
          data: this.chartEachList.price.map(item=>item.name),
          splitLine: {
            lineStyle: {
              color: '#84878c'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#84878c'
            }
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '客单件',
          min: 0,
          max:(value)=>value.max+1,
          axisLabel: {
            margin:5,
            formatter: '{value}',
            color: '#84878c'
          },
          axisLine: {
            lineStyle: {
              color: '#84878c'
            }
          }
        },
        {
          type: 'value',
          name: '客单价',
          min: 0,
          max:(value)=>Math.floor(value.max / 1000 + 1)*1000,
          axisLabel: {
            margin:5,
            formatter: '{value}',
            color: '#84878c'
          },
          splitLine: {
            show: false
          },
          axisLine: {
            lineStyle: {
              color: '#84878c'
            }
          }
        }
      ],
      legend: {
        type: 'plain',
        orient: 'horizontal',
        show: true,
        bottom: 10,
        data:['客单件','客单价'],
        selectedMode:false
      },
      series : [
        {
          name:'客单件',
          type:'bar',
          data:this.chartEachList.count.map(item=>item.value),
          itemStyle:{
            color: '#dc5569'
          }
        },
        {
          name:'客单价',
          type:'line',
          yAxisIndex: 1,
          data:this.chartEachList.price.map(item=>item.value),
          itemStyle:{
            color: '#323232'
          }
        }
      ]
    });
  }

  initChartsWeekSales(): void {
    let names = ['第一周','第二周','第三周','第四周','第五周'];
    let ctx = this.weekSalesElement.nativeElement;
    this.chart = echarts.init(ctx);
    this.chart.setOption({
      xAxis:
      {
        type: 'category',
        data: names,
        axisTick: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      series : [
        {
          name:'周销量',
          type:'line',
          data:names.map(item=>{
            return {name:item, value: Math.round(Math.random() * 2000)}
          }),
          label: {
            show: true,
            color: '#84878c'
          },
          itemStyle: {
            color:'#dc5569'
          }
        }
      ]
    });
  }

  initChartsMonthSales(): void {
    let names = [];
    for(let i=1; i<13; i++) {
      names.push(i+'月');
    }
    let ctx = this.monthSalesElement.nativeElement;
    this.chart = echarts.init(ctx);
    this.chart.setOption({
      xAxis:
      {
        type: 'category',
        data: names,
        axisTick: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      series : [
        {
          name:'月销量',
          type:'line',
          data:names.map(item=>{
            return {name:item, value: Math.round(Math.random() * 2000)}
          }),
          label: {
            show: true,
            color: '#84878c'
          },
          itemStyle: {
            color:'#dc5569'
          }
        }
      ]
    });
  }

  initChartsMonthSalesCompare(): void {
    let names = [];
    for(let i=1; i<13; i++) {
      names.push(i+'月');
    }
    let ctx = this.monthSalesCompareElement.nativeElement;
    this.chart = echarts.init(ctx);
    this.chart.setOption({
      xAxis:
      [{
        type: 'category',
        data: names,
        axisTick: {
          show: false
        }
      }],
      yAxis: [{
        type: 'value',
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        }
      }],
      legend: {
        bottom: 10,
        data:['2016年','2017年'],
      },
      series : [
        {
          name:'月销量',
          type:'bar',
          data:names.map(item=>{
            return {name:item, value: Math.round(Math.random() * 2000)}
          }),
          itemStyle:{
            color:'#dc5569'
          }
        },
        {
          name:'月销量',
          type:'bar',
          data:names.map(item=>{
            return {name:item, value: Math.round(Math.random() * 2000)}
          }),
          itemStyle:{
            color:'#2980d9'
          }
        }
      ]
    });
  }

  initChartsQuarterAmount(): void {
    const REGIONS = [
      {name:"第一季度", color:"#2980d9"},
      {name:"第二季度", color:"#5a9e47"},
      {name:"第三季度", color:"#fb8800"},
      {name:"第四季度", color:"#dc5569"},
    ]
    let names = REGIONS.map(item=>item.name);
    let ctx = this.quarterAmountElement.nativeElement;
    this.chart = echarts.init(ctx);
    this.chart.setOption({
      tooltip : {
        trigger: 'item'
      },
      legend: {
        type: 'plain',
        orient: 'horizontal',
        show:true,
        bottom: 20,
        data: names,
        selectedMode:false,
        textStyle: {
          color: '#84878c'
        }
      },
      series : [
        {
          name:'季度销量',
          type:'pie',
          radius : ['30%', '55%'],
          center: ['50%', '35%'],
          data:REGIONS.map(item=>{
            return {name:item.name, value: Math.round(Math.random() * 100000)}
          }),
          label: {
            show:true,
            formatter: '{c}'
          }
        }
      ],
      color:REGIONS.map(item=>item.color)
    });
  }

  reqRefresh() {
    this.onReqList();
  }

  findRegion(id: string) {
    let ret = this.regionList.find(item=>item._id===id);
    if (ret) {
      return ret;
    } else {
      return null;
    }
  }

  int2CssColor(value: Number) {
    let color = `000000${new Number(value).toString(16)}`;
    color = color.substr(color.length-6, 6);
    return '#'+color;
  }

  onRefresh() {
    this.chartAmountList = [];
    this.chartEachList = [];
    let regionShops = {};
    this.shopList.forEach((item)=>{
      if (item.shop && item.shop.region_id) {
        if (!regionShops[item.shop.region_id]){
          regionShops[item.shop.region_id] = [];
        }
        regionShops[item.shop.region_id].push(item);
      }
    })

    let regions = [];
    let analyseMaxCount = 9;
    for(let reId in regionShops) {
      let region = this.findRegion(reId);
      let shop = regionShops[reId];
      if (region) {
        let item = {
          name:region.name,
          color:this.int2CssColor(region.color_css),
          amount:shop.reduce((pre,cur,index,arr)=>{
            return {amount:pre.amount+cur.amount}
          }, {amount:0}).amount,
          count:shop.reduce((pre,cur,index,arr)=>{
            return {count:pre.count+cur.count}
          }, {count:0}).count,
          sub_count:shop.reduce((pre,cur,index,arr)=>{
            return {sub_count:pre.sub_count+cur.sub_count}
          }, {sub_count:0}).sub_count,
        };
        if (regions.length > analyseMaxCount) {
          regions[analyseMaxCount].amount += item.amount;
          regions[analyseMaxCount].count += item.amount;
          regions[analyseMaxCount].sub_count += item.sub_count;
        } else {
          if (regions.length === analyseMaxCount) {
            item.name = '其他';
          }
          regions.push(item)
        }
      }
    }
    this.chartEachList.price = [];
    this.chartEachList.count = [];
    for(let i=0; i<regions.length; i++) {
      let region = regions[i];
      this.chartAmountList.push({name:region.name, color:region.color, value:new Number(region.amount).toFixed(0)});

      if (i < analyseMaxCount) {
        this.chartEachList.price.push({name:region.name, color:region.color, value:Math.floor(region.count===0?0:(region.amount/region.count))})
        this.chartEachList.count.push({name:region.name, color:region.color, value:Math.floor(region.count===0?0:(region.sub_count*10/region.count))/10})
      }
    }

    console.log("analyse-shop onRefresh" + JSON.stringify(this.chartAmountList));
    // this.chartAmountList.sort((a,b)=>a.amount>b.amount?-1:1);
    this.initChartsDayAmount();
    switch(this.currentDateType) {
      case E_DATE_TYPES.DAY:
      this.initChartsDayEach();
      break;
      case E_DATE_TYPES.WEEK:
      this.initChartsDayEach();
      break;
      case E_DATE_TYPES.MONTH:
      break;
      case E_DATE_TYPES.YEAR:
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
            this.shopList = result.analyseShopList;
            this.onRefresh();
          }
        })
      break;
      case E_DATE_TYPES.WEEK:
        this.analyseProvider.getShopAnalyseWeekList(this.currentDateType).then((result)=>{
          if (result) {
            this.shopList = result.analyseShopList;
            this.onRefresh();
          }
        })
      break;
      case E_DATE_TYPES.MONTH:
        this.analyseProvider.getShopAnalyseMonthList(this.currentDateType).then((result)=>{

        })
      break;
      case E_DATE_TYPES.YEAR:
        this.analyseProvider.getShopAnalyseYearList(this.currentDateType).then((result)=>{

        })
      break;
      default:
      this.analyseProvider.getShopAnalyseDayList(this.currentDateType).then((result)=>{

      })
      break;
    }
  }

  onBtnDayClicked = () => {
    this.currentDateType = E_DATE_TYPES.DAY;
    this.reqRefresh();
  }

  onBtnWeekClicked = () => {
    this.currentDateType = E_DATE_TYPES.WEEK;
    this.reqRefresh();
  }

  onBtnMonthClicked = () => {
    this.currentDateType = E_DATE_TYPES.MONTH;
    this.reqRefresh();
  }

  onBtnYearClicked = () => {
    this.currentDateType = E_DATE_TYPES.YEAR;
    this.reqRefresh();
  }

  subscribeEvents() {
  }

}
