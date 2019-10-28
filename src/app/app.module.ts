import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {FranceMeteoApp} from './app.component';

import {FileListPage} from '../pages/file-list/file-list';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {FileUploadPage} from "../pages/file-upload/file-upload";
import {FileChooser} from "@ionic-native/file-chooser";
import {IonicStorageModule} from "@ionic/storage";
import {File} from "@ionic-native/file";
import {FilePath} from "@ionic-native/file-path";
import {FileDetailsPage} from "../pages/file-details/file-details";
import {FileDetailsGraphHourlyPage} from "../pages/file-details-graph-hourly/file-details-graph-hourly";
import {ChartModule} from "angular-highcharts";
import {FileDetailsGraphPage} from "../pages/file-details-graph/file-details-graph";

@NgModule({
  declarations: [
    FranceMeteoApp,
    FileListPage,
    FileUploadPage,
    HomePage,
    TabsPage,
    FileDetailsPage,
    FileDetailsGraphPage,
    FileDetailsGraphHourlyPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(FranceMeteoApp),
    IonicStorageModule.forRoot(),
    ChartModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    FranceMeteoApp,
    FileListPage,
    FileUploadPage,
    HomePage,
    TabsPage,
    FileDetailsPage,
    FileDetailsGraphPage,
    FileDetailsGraphHourlyPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FileChooser,
    FilePath,
    File,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
