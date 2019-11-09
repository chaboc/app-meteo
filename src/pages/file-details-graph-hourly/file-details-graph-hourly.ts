import {Component, Input} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {FileModel} from "../../models/midas-data.model";
import {Chart} from 'angular-highcharts';

/**
 * Generated class for the FileDetailsGraphHourlyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'app-file-details-graph-hourly',
  templateUrl: 'file-details-graph-hourly.html'
})

export class FileDetailsGraphHourlyPage {
  @Input() fileData: FileModel;
  @Input() part: string;
  chart = null;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.fileData = this.navParams.get('fileData');
  }

  ngOnInit() {
    const tmpStats = this.fileData.getStats();
    const tmpHourlyStats = this.fileData.getHourlyStats(this.part);
    let tmpSeries = [{
      name: 'Minimum',
      data: []
    },
      {
        name: 'Moyenne',
        data: []
      },
      {
        name: 'Maximum',
        data: []
      }];
    for (let tmpHour in tmpHourlyStats) {
      const hour = tmpHourlyStats[tmpHour];
      if (!hour)
        continue;
      // console.log(JSON.stringify(hour));
      tmpSeries[0].data.push(hour.min);
      tmpSeries[1].data.push((hour.avg.total / hour.avg.count));
      tmpSeries[2].data.push(hour.max);
    }
    // console.log(JSON.stringify(tmpSeries));
    // console.log(JSON.stringify(tmpStats[this.part]));
    if (!tmpStats[this.part]){
      this.chart = undefined;
      return;
    }
    // console.log(JSON.stringify(this.part));
    this.chart = new Chart({
      chart: {
        type: 'line'
      },
      title: {
        text: this.part
      },
      credits: {
        enabled: false
      },
      yAxis: {
        plotLines: [{
          value: tmpStats[this.part].min.value,
          color: 'blue',
          dashStyle: 'shortdash',
          width: 2,
          label: {
            text: 'Minimum'
          }
        }, {
          value: (tmpStats[this.part].avg.total / tmpStats[this.part].avg.count),
          color: 'green',
          dashStyle: 'shortdash',
          width: 2,
          label: {
            text: 'Moyenne'
          }
        }, {
          value: tmpStats[this.part].max.value,
          color: 'red',
          dashStyle: 'shortdash',
          width: 2,
          label: {
            text: 'Maximum'
          }
        }]
      },
      series: tmpSeries
    });
  }

}
