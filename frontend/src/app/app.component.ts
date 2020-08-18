import {Component} from '@angular/core';
import {ApiService} from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
  files: any;

  constructor(
    private api: ApiService
  ) {
  }

  public handleFileInput(files: FileList): void {
    this.files = files;
    this.uploadFile();
  }

  public uploadFile(): void {
    this.api.uploadFile(this.files).subscribe(response => {});
  }
}
