import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { ImagePicker } from '@ionic-native/image-picker'

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';

import { API } from '../api/api';
import { CustomerProvider, UserProvider, CommonProvider, CartProvider } from '../providers';

import { MyApp } from './app.component';
import { ShopPageModule } from '../pages/shop/shop.module';
import { HomePageModule } from '../pages/home/home.module';
import { OrderCreateModule } from '../pages/order-create/order-create.module';
import { CartPayModule } from '../pages/cart-pay/cart-pay.module';
import { CartListModule } from '../pages/cart-list/cart-list.module';
import { OrderTrackModule } from '../pages/order-track/order-track.module';
import { CustomerModule } from '../pages/customer/customer.module';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HomePageModule,
    ShopPageModule,
    OrderCreateModule,
    CartPayModule,
    CartListModule,
    OrderTrackModule,
    CustomerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    StatusBar,
    SplashScreen,
    API,
    UserProvider,
    CustomerProvider,
    CommonProvider,
    CartProvider,
    File,
    FileTransfer,
    ImagePicker
  ]
})
export class AppModule {}
