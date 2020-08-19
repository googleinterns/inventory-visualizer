import {Component} from '@angular/core';
import {ApiService} from './api.service';
import {SegmentedTimelineDataResponse, SegmentData, SegmentedTimelineCompareResponse, SegmentedDataErrorResponse} from './proto/protobuf/data';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Inventory Visualizer';
  dataResponse: SegmentedTimelineDataResponse;
  data: Array<any[]>;
  segments: SegmentData[];
  page: number;
  updateCharts: Subject<any> = new Subject();
  files: string[];
  hasDisplayedData: boolean;


  constructor(
    private api: ApiService
  ) {
    this.segments = [];
    this.files = [];
    this.page = 0;
    this.hasDisplayedData = false;
  }

  scrollHandler(): void {
    this.page += 1;
    this.getData();
  }

  public handleFileInput(files: FileList): void {
    this.files.push(files[0].name);
    this.uploadFile(files);
  }

  public uploadFile(file): void {
    this.api.uploadFile(file).subscribe(response => {
      this.getData();
    });
  }

  signalChildForChartUpdates(changes): void {
    this.updateCharts.next(changes);
  }

  getData(): void {
    this.api.getSegmentedData(this.files[0], this.page, 8).subscribe(res => {
      this.dataResponse = SegmentedTimelineDataResponse.fromJSON(res);
      this.segments = [];
      this.dataResponse.data.forEach(item => this.segments.push(item));
      this.signalChildForChartUpdates(this.segments);
      this.hasDisplayedData = true;
    });
  }
}


