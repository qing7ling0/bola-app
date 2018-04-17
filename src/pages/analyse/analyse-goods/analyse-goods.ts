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

  materialSourceMap: Map<string, any> = new Map(); // 材质库
  materialSourceList:  Array<any> = []; // 材质库

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
        this.materialSourceList = result || [];
        this.materialSourceList.forEach(element => {
          this.materialSourceMap.set(element._id, element);
        });
        this.onReqList();
      }
    });
  }

  ionViewDidEnter(): void {
  }

  initChartsTop10(): void {
    let ctx = this.goodsTop10Element.nativeElement;
    this.chart = echarts.init(ctx);
    let top10PerDatas = this.top10SalesPerList;
    if (!top10PerDatas || top10PerDatas.length === 0) return;

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
              return this.priceFormat(top10PerDatas[params.dataIndex], 2)
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
              return this.priceFormat(top10PerDatas[params.dataIndex+2]-top10PerDatas[params.dataIndex],2)
            }
          }
        }
      ],
      color:["#C0A64F", "#323232"]
    });
  }

  initChartsMaterial(): void {
    let ctx = this.goodsMatrialElement.nativeElement;
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
            show:true,
            formatter:item=>this.priceFormat(item.value, 0)
          }
        }
      ],
      // color:this.materialList.map(item=>item.color)
    });
  }

  initChartsQuarterMaterial(): void {
    let ctx = this.goodsQuarterMatrialElement.nativeElement;
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
        data: QUARTER_NAMES
      },
      yAxis: {
        type: 'value',
        show:true,
      },
      series : this.quarterMaterialList.map((item)=>{
        return {
          name:item.name,
          type: 'bar',
          stack: '总量',
          data:item.value,
          label: {
            show:false
          }
        }
      }),
    });
  }

  initChartsSex(): void {
    let ctx = this.goodsSexElement.nativeElement;
    // this.salesSexList = [
    //   {
    //     name:'男',
    //     color:'#2980D9',
    //     value:100,
    //   },
    //   {
    //     name:'女',
    //     color:'#EB4986',
    //     value:200
    //   },
    // ];
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
            show:true,
            formatter:item=>this.priceFormat(item.value, 0)
          }
        }
      ],
      color:this.salesSexList.map(item=>item.color)
    });
  }

  initChartsQuarterSex(): void {
    let ctx = this.goodsQuarterSexElement.nativeElement;
    // this.quarterSexList = [
    //   {
    //     NID:'',
    //     name:'男',
    //     color:'#ff0000',
    //     value:[100, 200, 239, 490],
    //   },
    //   {
    //     NID:'',
    //     name:'女',
    //     color:'#ff00ff',
    //     value:[130, 100, 139, 590],
    //   },
    // ];
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
        data: QUARTER_NAMES
      },
      yAxis: {
        type: 'value',
        show:true,
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
      color: this.quarterSexList.map(item=>item.color),
    });
  }

  initChartsPrices(): void {
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
          },
          label: {
            show:true,
            position: 'top'
          }
        }
      ]
    });
  }

  initChartsQuarterPrice(): void {
    let ctx = this.goodsQuarterPriceElement.nativeElement;
    this.chart = echarts.init(ctx);
    this.chart.setOption({
      legend: {
        type: 'plain',
        orient: 'horizontal',
        show:true,
        top:10,
        data: QUARTER_NAMES,
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
        data: this.quarterPriceSource.types
      },
      yAxis: {
        type: 'value',
        show:true,
      },
      series : this.quarterPriceList.map((item, index)=>{
        return {
          name:QUARTER_NAMES[index],
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
    if (this.top10List) {
      for(let item of this.top10List) {
        if (this.materialSourceMap.has(item.material)) {
          let mat = this.materialSourceMap.get(item.material);
          item.material_name = mat && mat.name || "";
        } else {
          item.material_name = "";
        }
      }
    }
    
    if (this.materialList) {
      this.materialSourceList.forEach(item=>{
        let findIndex = this.materialList.findIndex(mat=>mat._id === item._id)
        if (findIndex === -1) {
          this.materialList.push({_id:item._id, value:0});
        }
      })

      for(let item of this.materialList) {
        if (this.materialSourceMap.has(item._id)) {
          let mat = this.materialSourceMap.get(item._id);
          item.name = mat.name;
          item.color = this.int2CssColor(mat.color_css);
        } else {
          item.name = "";
          item.color = "#ff0000";
        }
      }
    }

    if (this.salesSexList) {
      constants.SEX_DATA.forEach(item => {
        let findIndex = this.salesSexList.findIndex(sex=>sex.name === item.value);
        if (findIndex === -1) {
          this.salesSexList.push({name:item.value, value:0, color:item.color})
        }
      })
    }

    if (this.quarterMaterialSourceList) {
      this.quarterMaterialList = [];
      let materialMap = {};
      this.materialSourceMap.forEach(item=>{
        this.quarterMaterialList.push({
          _id:item._id,
          name:item.name,
          color:this.int2CssColor(item.color_css),
          value:new Array(this.quarterMaterialSourceList.length)
        })
        materialMap[item._id] = new Array(this.quarterMaterialSourceList.length);
      })
      this.quarterMaterialSourceList.forEach((item,index) => {
        item.forEach(element => {
          let mat = materialMap[element.material];
          if (mat) {
            mat[index] = element.value;
          }
        });
      })
      for(let item of this.quarterMaterialList) {
        let mat = materialMap[item._id];
        if (mat) {
          item.value = mat;
        }
      }
    }
    if (this.quarterPriceSource) {
      this.quarterPriceList = this.quarterPriceSource.list || [];
    }

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
      this.initChartsPrices();
      this.initChartsQuarterPrice();
      break;
      default:
      break;
    }
  }

  onReqList() {
    switch(this.currentDateType) {
      case E_DATE_TYPES.DAY:
        this.analyseProvider.getGoodsAnalyseDayList(this.currentDateType).then((result)=>{
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
        this.analyseProvider.getGoodsAnalyseWeekList(this.currentDateType).then((result)=>{
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
        this.analyseProvider.getGoodsAnalyseMonthList(this.currentDateType).then((result)=>{
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
        this.analyseProvider.getGoodsAnalyseYearList(this.currentDateType).then((result)=>{
          if (result) {
            this.top10List = result.analyseGoodsTop10;
            this.top10SalesPerList = result.analyseGoodsSalesPer;
            this.materialList = result.analyseGoodsMaterial;
            this.salesSexList = result.analyseGoodsSex;
            this.priceList = result.analyseGoodsPrice;
            this.quarterMaterialSourceList = result.analyseGoodsMaterialList4Quarter;
            this.quarterSexList = result.analyseGoodsSexList4Quarter;
            this.quarterPriceSource = result.analyseGoodsPriceList4Quarter;
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
