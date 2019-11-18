import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {FileChooser} from "@ionic-native/file-chooser";
import {File} from '@ionic-native/file';
import {FilePath} from "@ionic-native/file-path";
import {FileModel} from "../../models/midas-data.model";

@Component({
  selector: 'page-file-upload',
  templateUrl: 'file-upload.html'
})

export class FileUploadPage {
  loading: boolean = false;

  constructor(public navCtrl: NavController, private chooser: FileChooser, private file: File, private filePath: FilePath) {
    this.loading = false;
  }

  chooseFile() {
    this.chooser.open().then(file => {
      this.filePath.resolveNativePath(file).then(resolvedFilePath => {

        let path = resolvedFilePath.substring(0, resolvedFilePath.lastIndexOf('/'));
        let file = resolvedFilePath.substring(resolvedFilePath.lastIndexOf('/') + 1, resolvedFilePath.length);
        const ext = file.substring(file.lastIndexOf('.') + 1);
        console.log(JSON.stringify(path), JSON.stringify(file), JSON.stringify(ext));
        if (ext !== "his") {
          alert("Not a valid file");
          return;
        }
        this.loading = true;
        this.copyCsvData(path, file);
      }).catch(err => {
        console.error(JSON.stringify(err));
      });

    }).catch(err => {
      console.error(JSON.stringify(err.toString()));
      alert(JSON.stringify(err));
    });
  }


  private copyCsvData(path, file) {
    this.file.createDir(this.file.applicationStorageDirectory, "new", true).then(value3 => {
      this.readFile(path, file).then((value: any) => {
        console.log(value.originalFilename, '/', value.newFilename, ': ', value.tsvItems.length);
        console.log(JSON.stringify(value3));
        this.file.copyFile(path, file, this.file.applicationStorageDirectory + '/new', value.newFilename).then(value2 => {
          this.loading = false;
          alert("Copy of " + file + " successful");
        }).catch(reason => {
          alert(JSON.stringify(reason));
          console.error(JSON.stringify(reason));
        })
      }).catch(reason => {
        alert(reason.toString());
        console.error(JSON.stringify(reason, Object.getOwnPropertyNames(reason)));
      })
    }).catch(reason => {
      alert(reason.toString());
      console.error(JSON.stringify(reason));
    });

  }
  readFile(path: string, file: string): Promise<FileModel> {
    const this1 = this;
    return new Promise(function (resolve, reject) {
      this1.file.readAsText(path, file)
        .then(content => {
          const obj = new FileModel(path, file, content);
          resolve(obj);
        })
        .catch(err => {
          console.log(JSON.stringify(err));
          alert(JSON.stringify(err));
          reject(err);
        });
    });
  }

}
