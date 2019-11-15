import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {Entry, File} from '@ionic-native/file';
import {FilePath} from "@ionic-native/file-path";
import {FileModel} from "../../models/midas-data.model";
import {FileDetailsPage} from "../file-details/file-details";

@Component({
  selector: 'page-file-list',
  templateUrl: 'file-list.html'
})
export class FileListPage {
  listFiles = [];
  loading = false;

  constructor(public navCtrl: NavController, private file: File, private filePath: FilePath) {
  }

  ionViewWillEnter() {
    this.load()
  }

  load() {
    this.loading = false;
    console.log("List dir : " + this.file.applicationStorageDirectory);
    this.listFiles = [];
    this.file.listDir(this.file.applicationStorageDirectory, 'new').then(
      (value: Entry[]) => {
        console.log(value);
        this.listFiles = [];
        for (const toto of value) {
          this.listFiles.push(toto);
        }
      }
    ).catch(reason => {
      console.error(JSON.stringify(reason));
    });
  }

  itemSelected(file) {
    this.loading = true;
    console.log('Open ' + file.nativeURL);
    this.filePath.resolveNativePath(file.nativeURL).then(resolvedFilePath => {

      let path = resolvedFilePath.substring(0, resolvedFilePath.lastIndexOf('/'));
      let file = resolvedFilePath.substring(resolvedFilePath.lastIndexOf('/') + 1, resolvedFilePath.length);
      const ext = file.substring(file.lastIndexOf('.') + 1);
      console.log(JSON.stringify(path), JSON.stringify(file), JSON.stringify(ext));
      this.readFile(path, file).then((value: FileModel) => {
        console.log(value.originalFilename, '/', value.newFilename, ': ', value.tsvItems.length);
        this.loading = false;

        this.navCtrl.push(FileDetailsPage, {
          fileData: value
        });
      }).catch(reason => {
        alert(reason.toString());
        console.error(JSON.stringify(reason, Object.getOwnPropertyNames(reason)));
      })
    }).catch(err => {
      console.error(JSON.stringify(err));
    });
  }
  readFile(path: string, file: string): Promise<FileModel> {
    console.log('this1Provider ReadFile');
    const this1 = this;
    return new Promise(function (resolve, reject) {
      this1.file.readAsText(path, file)
        .then(content => {
          console.log("Start read of " + file + " successful");
          const obj = new FileModel(path, file, content);
          console.log("Read of " + file + " successful");
          resolve(obj);
        })
        .catch(err => {
          console.log(JSON.stringify(err));
          alert(JSON.stringify(err));
          reject(err);
        });
    });
  }

  deleteFile(file) {
    console.log('Delete ' + file);
    this.filePath.resolveNativePath(file).then(value => {
      console.log(JSON.stringify(value));
      const path = value.substr(0, value.lastIndexOf('/') + 1).replace(':', '');
      const filename = value.substr(1 + value.lastIndexOf('/')).replace(':', '');

      console.log(path, filename)
      this.file.removeFile(path, filename).then(value => {
        console.log(JSON.stringify(value));
        this.load();
      }).catch(reason => {
        console.error(JSON.stringify(reason));
      })
    }).catch(reason => {
      console.error(JSON.stringify(reason));
    });
  }
}
