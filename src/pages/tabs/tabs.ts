import {Component} from '@angular/core';
import {FileListPage} from '../file-list/file-list';
import {HomePage} from '../home/home';
import {FileUploadPage} from "../file-upload/file-upload";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = FileListPage;
  tab3Root = FileUploadPage;

  constructor() {

  }
}
