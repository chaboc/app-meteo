import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {FileModel} from "../../models/midas-data.model";
import {FileDetailsGraphHourlyPage} from "../file-details-graph-hourly/file-details-graph-hourly";
import {FileDetailsGraphPage} from "../file-details-graph/file-details-graph";

/**
 * Generated class for the FileDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-file-details',
  templateUrl: 'file-details.html',
})
export class FileDetailsPage {
  fileData: FileModel;
  @ViewChild(FileDetailsGraphHourlyPage) graphHourly: FileDetailsGraphHourlyPage;
  stats;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.fileData = this.navParams.get('fileData');
  }

  ngOnInit() {
    console.log("Loading stats");
    this.stats = JSON.stringify(this.fileData.getStats());
    console.log("Loaded stats");
  }

  goToGraphPage() {
    this.navCtrl.push(FileDetailsGraphPage, {
      fileData: this.fileData
    });
  }

}
