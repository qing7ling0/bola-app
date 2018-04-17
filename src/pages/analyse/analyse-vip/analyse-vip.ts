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

const QUARTER_NAMES = ['季度一','季度二','季度三','季度四']
const VIP_NAMES = [{name:"新会员", color:"#93c24e"}, {name:"老会员", color:"#fb8800"}]

@Component({
  selector: 'page-analyse-vip',
  templateUrl: 'analyse-vip.html'
})
export class AnalyseVipPage implements OnInit {
  @ViewChild('analyseVipNewAndOld') vipNewAndOldElement: ElementRef;
  @ViewChild('analyseVipCountPer') vipCountPerElement: ElementRef;
  @ViewChild('analyseVipAmountPer') vipAmountPerElement: ElementRef;
  @ViewChild('analyseVipMonthSalesCount') vipMonthSalesCountElement: ElementRef;
  @ViewChild('analyseVipQuarterSalesCount') vipQuarterSalesCountElement: ElementRef;
  @ViewChild('analyseVipBuyCount') vipBuyCountElement: ElementRef;

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

  materialSourceMap: Map<string, any> = new Map(); // 材质库

  top10List: Array<any> = []; // 销量Top10
  top10SalesPerList:Array<any> = []; // 销量top10占比
  materialList: Array<any> = []; // 销量材质
  salesSexList: Array<any> = []; // 销量男女
  priceList: Array<any> = []; // 价格分段
  quarterMaterialSourceList: Array<any> = []; // 季度材质分布
  quarterMaterialList: Array<any> = []; // 季度材质分布
  quarterSexList: Array<any> = []; // 季度男女分布
  quarterPriceSource: any = {list:[], types:[]}; // 季度价格分段分布
  quarterPriceList: Array<any> = []; // 季度价格分段分布
  top10AmountPer:string = '0%';
  top10CountPer:string = '0%';

  top3List: Array<any> = []; // 新增会员TOP3
  vipNewAndOldAmountList:  Array<any> = []; // 新老会员销售额
  countAndAmountPerList: Array<any> = []; // 客单价、客单件
  repeatBuyPer: any = {
    all_count:0,
    old_count:0,
    current_count:0,
    last_count:0,
    last_all_count:0,
    current_count_per:0,
    last_count_per:0,
    trend:0, // 趋势，-1下降，0不变，1上升
  } // 复购率

  repeatBuyCount:any = {
    current_all_count:0,
    current:0, // 本年
    current_per:0,
    last_all_count:0,
    last:0, // 上一年
    last_per:0,
    highest:0 // 最高消费次数
  }; // 人均复购次数

  buyCount: Array<any> = []; // 消费次数分布
  quarterBuyCountList: Array<any> = []; // 季度消费次数
  monthBuyCountList: Array<any> = []; // 月度周消费次数
  vaildVip: any = {
    all_count:0, // 总会员数
    vaild_count:0,// 有效会员数
    other_count:0,
  };

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
    this.commonProvider.getMaterialList().then((result)=>{
      if (result) {
        this.materialSourceMap = new Map();
        result.forEach(element => {
          this.materialSourceMap.set(element._id, element);
        });
        this.onReqList();
      }
    });
  }

  ionViewDidEnter(): void {
  }

  getCurrentDateString = () => {
    switch(this.currentDateType) {
      case E_DATE_TYPES.DAY:
        return "日";
      case E_DATE_TYPES.WEEK:
        return "周";
      case E_DATE_TYPES.MONTH:
        return "月";
      case E_DATE_TYPES.YEAR:
        return "年";
      default:
        return "日";
    }
  }

  initChartsVipNewAndOld(): void {
    // this.vipNewAndOldAmountList = [112,200]
    let total = this.vipNewAndOldAmountList.reduce((prev, cur)=>(prev+cur), 0);
    let ctx = this.vipNewAndOldElement.nativeElement;
    this.chart = echarts.init(ctx);
    this.chart.setOption({
      legend: {
        type: 'plain',
        orient: 'horizontal',
        show:true,
        data: VIP_NAMES,
        selectedMode:false
      },
      series : [
        {
          name:'新老客户销售比',
          type:'pie',
          radius : ['25%', '55%'],
          center: ['50%', '45%'],
          data:this.vipNewAndOldAmountList,
          label: {
            show:true,
            position:"inside",
            formatter:item=>{
              let per = total === 0 ? 0 : (item.value*100 / total);
              return new Number(per).toFixed(2)+"%";
            }
          }
        }
      ],
      color:VIP_NAMES.map(item=>item.color)
    });
  }

  initChartsCountPer(): void {
    // this.countAndAmountPerList = [2.3,3500, 3.6,4500]
    let ctx = this.vipCountPerElement.nativeElement;
    this.chart = echarts.init(ctx);
    this.chart.setOption({
      legend: {
        type: 'plain',
        orient: 'horizontal',
        show:false,
        right: 10,
        left: 10,
        bottom: 20,
        data: ["客单件"],
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
        data: ["客单件"],
        axisTick: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        show:false,
      },
      series : VIP_NAMES.map((item, index)=>{
        return {
          name:item.name,
          type: 'bar',
          data:[this.countAndAmountPerList[index*2]],
          label: {
            show:true,
            formatter:item=>this.priceFormat(item.value,2)
          },
          itemStyle: {
            color:item.color
          }
        }
      })
    });
  }
  
  initChartsAmountPer(): void {
    // this.countAndAmountPerList = [2.3,3500, 3.6,4500]
    let ctx = this.vipAmountPerElement.nativeElement;
    this.chart = echarts.init(ctx);
    this.chart.setOption({
      legend: {
        type: 'plain',
        orient: 'horizontal',
        show:false,
        right: 10,
        left: 10,
        bottom: 20,
        data: ["客单价"],
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
        data: ["客单价"],
        axisTick: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        show:false,
      },
      series : VIP_NAMES.map((item, index)=>{
        return {
          name:item.name,
          type: 'bar',
          data:[this.countAndAmountPerList[index*2+1]],
          label: {
            show:true,
            formatter:item=>this.priceFormat(item.value)
          },
          itemStyle: {
            color:item.color
          }
        }
      }),
    });
  }

  initChartsMonthSalesCount(): void {
    let date = moment(moment().subtract(4, "month").format("YYYY-MM"));
    let names = [];
    for(let i=0; i<4; i++) {
      names.push(date.format("YY-MM"));
      date.add(1, "month");
    }
    let ctx = this.vipMonthSalesCountElement.nativeElement;
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
        show:false
      },
      series : [
        {
          name:'老会员销售分布',
          type:'line',
          data:this.monthBuyCountList||[],
          label: {
            show: true,
            color: '#84878c',
            formatter:item=>this.priceFormat(item.value)
          },
          itemStyle: {
            color:'#dc5569'
          }
        }
      ]
    });
  }

  initChartsQuarterSalesCount(): void {
    let ctx = this.vipQuarterSalesCountElement.nativeElement;
    this.chart = echarts.init(ctx);
    this.chart.setOption({
      xAxis:
      {
        type: 'category',
        data: QUARTER_NAMES,
        axisTick: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        show:false
      },
      series : [
        {
          name:'季度销量',
          type:'line',
          data:this.quarterBuyCountList||[],
          label: {
            show: true,
            color: '#84878c',
            formatter:item=>this.priceFormat(item.value)
          },
          itemStyle: {
            color:'#dc5569'
          }
        }
      ]
    });
  }

  
  initChartsBuyCount(): void {
    let ctx = this.vipBuyCountElement.nativeElement;
    this.chart = echarts.init(ctx);
    let names = this.buyCount.map(item=>item.name);
    let values = this.buyCount.map(item=>item.value);
    // let values = [100,65,89,71];
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
        show:false
      },
      series : [
        {
          name:'销量分布',
          type:'line',
          data:values,
          label: {
            show: true,
            color: '#84878c',
            formatter:item=>this.priceFormat(item.value)
          },
          itemStyle: {
            color:'#dc5569'
          }
        }
      ]
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
    if (!this.top3List) {
      this.top3List = [];
    }
    this.top3List.map(item=>{
      item.per = item.total_count === 0 ? 0 : (item.count / item.total_count);
      item.perString = new Number(item.per*100).toFixed(2) + "%";
      return item;
    })

    if (!this.repeatBuyPer) {
      this.repeatBuyPer = {
        all_count:0,
        old_count:0,
        current_count:0,
        last_count:0,
        last_all_count:0,
        current_count_per:0,
        last_count_per:0,
        trend:0, // 趋势，-1下降，0不变，1上升
      }
    }
    this.repeatBuyPer.current_count_per = this.repeatBuyPer.all_count===0?0:(this.repeatBuyPer.current_count/this.repeatBuyPer.all_count);
    this.repeatBuyPer.last_count_per = this.repeatBuyPer.last_all_count===0?0:(this.repeatBuyPer.last_count/this.repeatBuyPer.last_all_count);
    this.repeatBuyPer.trend = this.repeatBuyPer.current_count_per > this.repeatBuyPer.last_count_per ? 1 :
    (this.repeatBuyPer.current_count_per < this.repeatBuyPer.last_count_per?-1:0); // 趋势，-1下降，0不变，1上升

    if (!this.repeatBuyCount) {
      this.repeatBuyCount = {
        current_all_count:0,
        current:0, // 本年
        current_per:0,
        last_all_count:0,
        last:0, // 上一年
        last_per:0,
        trend:0,
        highest:0 // 最高消费次数
      }; // 人均复购次数
    }
    this.repeatBuyCount.current_per = this.repeatBuyCount.current_all_count === 0 ? 0 : (this.repeatBuyCount.current / this.repeatBuyCount.current_all_count);
    this.repeatBuyCount.last_per = this.repeatBuyCount.last_all_count === 0 ? 0 : (this.repeatBuyCount.last / this.repeatBuyCount.last_all_count);
    this.repeatBuyCount.trend = this.repeatBuyCount.current_per > this.repeatBuyCount.last_per ? 1 :
    (this.repeatBuyCount.current_per < this.repeatBuyCount.last_per?-1:0); // 趋势，-1下降，0不变，1上升
    
    if (!this.vaildVip) {
      this.vaildVip = {
        all_count:0, // 总会员数
        vaild_count:0,// 有效会员数
        other_count:0,
      };
    }
    this.vaildVip.other_count =  this.vaildVip.all_count - this.vaildVip.vaild_count;
    
    this.initChartsVipNewAndOld();
    this.initChartsAmountPer();
    this.initChartsCountPer();
    switch(this.currentDateType) {
      case E_DATE_TYPES.DAY:
      break;
      case E_DATE_TYPES.WEEK:
      break;
      case E_DATE_TYPES.MONTH:
      this.initChartsMonthSalesCount();
      break;
      case E_DATE_TYPES.YEAR:
      this.initChartsQuarterSalesCount();
      this.initChartsBuyCount();
      break;
      default:
      break;
    }
  }

  onReqList() {
    switch(this.currentDateType) {
      case E_DATE_TYPES.DAY:
        this.analyseProvider.getVipAnalyseDayList(this.currentDateType).then((result)=>{
          if (result) {
            this.top3List = result.analyseVipShopTop;
            this.vipNewAndOldAmountList = result.analyseVipDay.newAndOldAmount;
            this.countAndAmountPerList = result.analyseVipDay.countAndAmountPer;
            this.onRefresh();
          }
        })
      break;
      case E_DATE_TYPES.WEEK:
        this.analyseProvider.getVipAnalyseWeekList(this.currentDateType).then((result)=>{
          if (result) {
            this.top3List = result.analyseVipShopTop;
            this.vipNewAndOldAmountList = result.analyseVipWeek.newAndOldAmount;
            this.countAndAmountPerList = result.analyseVipWeek.countAndAmountPer;
            this.repeatBuyPer = result.analyseVipWeek.repeatBuyPer;
            this.onRefresh();
          }
        })
      break;
      case E_DATE_TYPES.MONTH:
        this.analyseProvider.getVipAnalyseMonthList(this.currentDateType).then((result)=>{
          if (result) {
            this.top3List = result.analyseVipShopTop;
            this.vipNewAndOldAmountList = result.analyseVipMonth.newAndOldAmount;
            this.countAndAmountPerList = result.analyseVipMonth.countAndAmountPer;
            this.repeatBuyPer = result.analyseVipMonth.repeatBuyPer;
            this.monthBuyCountList = result.analyseVipMonth.monthBuyCountList;
            this.vaildVip = result.analyseVipMonth.vaildVip;
            this.onRefresh();
          }
        })
      break;
      case E_DATE_TYPES.YEAR:
        this.analyseProvider.getVipAnalyseYearList(this.currentDateType).then((result)=>{
          if (result) {
            this.top3List = result.analyseVipShopTop;
            this.vipNewAndOldAmountList = result.analyseVipYear.newAndOldAmount;
            this.countAndAmountPerList = result.analyseVipYear.countAndAmountPer;
            this.repeatBuyPer = result.analyseVipYear.repeatBuyPer;
            this.repeatBuyCount = result.analyseVipYear.repeatBuyCount;
            this.buyCount = result.analyseVipYear.buyCount;
            this.quarterBuyCountList = result.analyseVipYear.quarterBuyCountList;
            this.vaildVip = result.analyseVipYear.vaildVip;
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

  getBarStyle = (item) => {
    return {
      width: (item.per*100 + '%')
    }
  }

}
