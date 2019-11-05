import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {FileModel} from "../../models/midas-data.model";

/**
 * Generated class for the FileDetailsGraphPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-file-details',
  templateUrl: 'file-details-graph.html',
})
export class FileDetailsGraphPage{
  fileData: FileModel;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.fileData = this.navParams.get('fileData');
  }

  ngOnInit() {
  }

}
