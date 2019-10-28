
export class FileModel {
  originalFilename: string;
  newFilename: string;
  titles: string[];
  date: Date;
  tsvItems: any[] = []; 
  stats;
  hourlyStats;

  constructor(path: string, file: string, content: string) {
    this.originalFilename = file;
    this.loadFile(path, file, content);
  }

  private pad(nb, size) {
    let s = String(nb);
    while (s.length < (size || 2)) {
      s = "0" + s;
    }
    return s;
  }

  private formatParsedObject(arr) {
    let table = [];
    this.newFilename = this.originalFilename;

    for (let j = 0; j < arr.length; j++) {
      const items = arr[j];

      if (items.indexOf("") === -1) {
        if (j === 1) {
          this.titles = items;
        }
        else if (j > 1) {
          let newLine = {};
          for (const key in this.titles) {
            newLine[this.titles[key]] = items[key];
          }
          if (newLine['CREATEDATE'] && !this.date) {
            this.date = new Date(newLine['CREATEDATE']);
          }
          table.push(newLine as any[]);
        }
      }
    }

    if (this.date) {
      this.newFilename = this.date.getFullYear() + '-' + this.pad(this.date.getMonth() + 1, 2) + '-' + this.pad(this.date.getDate(), 2) + '.his';
    }
    console.log(table)
    return table;
  }

  public getUsableTitle() {
    const validatedTitles = [];
    for (let title of this.titles) {
      if (title != 'CREATEDATE' && !title.startsWith("LOCAL_WD_")){
        validatedTitles.push(title);
      }
      else
        console.log('Unwanted title: ',title);
    }
    return validatedTitles;
  }

  public getHourlyStats(stateName: string) {
    if (!this.hourlyStats) {
      this.hourlyStats = {};
    }
    if (this.hourlyStats[stateName]) {
      return this.hourlyStats[stateName];
    }
    this.hourlyStats[stateName] = {};
    for (let line of this.tsvItems) {
      if (!line) {
        continue;
      }
      let currentValue = parseFloat(line[stateName]);
      if (line[stateName] === ' ' || isNaN(currentValue))
        continue;
      const currentDate = new Date(line['CREATEDATE']);
      const currentHour = this.pad(currentDate.getHours(), 2) + ":00";
      if (!this.hourlyStats[stateName][currentHour]) {
        this.hourlyStats[stateName][currentHour] = {
          "name": stateName,
          "hour": currentHour,
          "min": null,
          "max": null,
          "avg": {'total': 0, 'count': 0}
        };
      }

      if (!this.hourlyStats[stateName][currentHour].min || this.hourlyStats[stateName][currentHour].min > line[stateName]) {
        this.hourlyStats[stateName][currentHour].min = currentValue;
      }
      if (!this.hourlyStats[stateName][currentHour].max || this.hourlyStats[stateName][currentHour].max < line[stateName]) {
        this.hourlyStats[stateName][currentHour].max = currentValue;
      }
      this.hourlyStats[stateName][currentHour].avg.total += currentValue;
      this.hourlyStats[stateName][currentHour].avg.count += 1;
    }
    return this.hourlyStats[stateName];
  }

  public getStats() {
    if (this.stats) {
      return this.stats;
    }
    this.stats = {};
    // let index = 1;
    for (let line of this.tsvItems) {
      if (!line) {
        continue;
      }
      for (let title of this.titles) {
        if (title === 'CREATEDATE' || title.startsWith("LOCAL_WD_")) {
          continue;
        }
        let currentValue = parseFloat(line[title]);
        if (line[title] === ' ' || isNaN(currentValue))
          continue;
        if (!this.stats[title]) {
          // console.log("Create stats title ", title, " for index = ", index);
          this.stats[title] = {
            "name": title,
            "min": {'value': null, 'comment': null, 'hour': null},
            "max": {'value': null, 'comment': null, 'hour': null},
            "avg": {'total': 0, 'count': 0}
          };
        }
        let currentDate = null;
        let currentHour = null;
        if (!this.stats[title].min.value || this.stats[title].min.value > line[title]) {
          this.stats[title].min.value = currentValue;
          if (title.startsWith("LOCAL_WS_"))
            this.stats[title].min.comment = line[title.replace('_WS_', '_WD_')];
          currentDate = new Date(line['CREATEDATE']);
          currentHour = this.pad(currentDate.getHours(), 2) + ":" + this.pad(currentDate.getMinutes(), 2) + ":" + this.pad(currentDate.getSeconds(), 2);
          this.stats[title].min.hour = currentHour;
        }
        if (!this.stats[title].max.value || this.stats[title].max.value < line[title]) {
          this.stats[title].max.value = currentValue;
          if (title.startsWith("LOCAL_WS_"))
            this.stats[title].max.comment = line[title.replace('_WS_', '_WD_')];
          if (!currentHour) {
            currentDate = new Date(line['CREATEDATE']);
            currentHour = this.pad(currentDate.getHours(), 2) + ":" + this.pad(currentDate.getMinutes(), 2) + ":" + this.pad(currentDate.getSeconds(), 2);
          }
          this.stats[title].max.hour = currentHour;
        }
        this.stats[title].avg.total += currentValue;
        this.stats[title].avg.count += 1;
      }
      // ++index;
    }
    return this.stats;
  }

  getStatsAsArray() {
    const data = this.getStats();
    const dataArray = [];
    for (let key in data) {
      dataArray.push(data[key]);
    }
    return dataArray;
  }

  private parseTSVFile(str) {
    var arr = [],
      row,
      col,
      c;
    str = str.replace('\r', '');
    for (row = col = c = 0; c < str.length; c++) {
      const cc = str[c];

      arr[row] = arr[row] || [];
      arr[row][col] = arr[row][col] || '';

      if (cc == '\t') {
        ++col;
        continue;
      }

      if (cc == '\n') {
        ++row;
        col = 0;
        continue;
      }

      arr[row][col] += cc;
    }

    return this.formatParsedObject(arr);
  }

  private loadFile(path, file, content) {
    console.log("Read of " + file + " started");
    this.tsvItems = this.parseTSVFile(content);
    console.log("Read of " + file + " finished");
  }
}
