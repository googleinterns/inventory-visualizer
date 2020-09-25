import { Component, Injectable, OnInit, ViewChild } from '@angular/core';
import { ApiService } from './api.service';
import {
  SegmentedTimelineDataResponse,
  SegmentData,
  SegmentedTimelineCompareResponse,
  SegmentedDataErrorResponse,
  CountryEventsResponse,
  ErrorPatternResponse,
} from './proto/protobuf/data';
import { Subject } from 'rxjs';
import {
  NgbModal,
  NgbDateStruct,
  NgbDateAdapter,
} from '@ng-bootstrap/ng-bootstrap';
import { Options } from 'ng5-slider';

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {
  readonly DELIMITER = '-';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      const date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[1], 10),
        month: parseInt(date[0], 10),
        year: parseInt(date[2], 10),
      };
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    return date
      ? date.month + this.DELIMITER + date.day + this.DELIMITER + date.year
      : null;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [{ provide: NgbDateAdapter, useClass: CustomAdapter }],
})
export class AppComponent implements OnInit {
  title = 'Inventory Visualizer';
  dataResponse: SegmentedTimelineDataResponse;
  data: Array<any[]>;
  segments: SegmentData[];
  page: number;

  updateCharts: Subject<any> = new Subject();
  compareData: Subject<any> = new Subject();
  errorData: Subject<any> = new Subject();
  clearCharts: Subject<any> = new Subject();
  updateFilters: Subject<any> = new Subject();
  eventData: Subject<any> = new Subject();
  errorPatterns: Subject<any> = new Subject();

  files: string[];
  events: string;
  hasDisplayedData: boolean;
  hasDisplayedErrorData: boolean;

  filters: {
    device: string;
    countries: string[];
    fromDate: string;
    toDate: string;
    timePeriod: string;
    order: string;
    threshold: number;
  };
  thresholdValue: number = 10;
  thresholdOptions: Options = {
    floor: 0,
    ceil: 100,
    step: 0.1,
  };
  fromDate: string;
  toDate: string;
  countries = [];
  devices = [];
  timePeriods = [
    { id: 'day', name: 'Daily' },
    { id: 'week', name: 'Weekly' },
    { id: 'month', name: 'Monthly' },
  ];
  selectedDeviceId: string;
  selectedTimePeriodId: string;
  selectedCountryIds: string[];
  order: string;
  @ViewChild('fileInput') fileInput;

  constructor(private api: ApiService, private modalService: NgbModal) {
    this.segments = [];
    this.files = [];
    this.page = 0;
    this.hasDisplayedData = false;
    this.hasDisplayedErrorData = false;
    this.filters = {
      device: null,
      countries: [],
      fromDate: null,
      toDate: null,
      timePeriod: null,
      order: null,
      threshold: null,
    };
  }

  ngOnInit(): void {
    const username = this.generateRandomString(15);
    this.api.registerUser(username).subscribe((res) => {
      localStorage.setItem('token', res.token);
    });
  }

  generateRandomString(length: number): string {
    let text = '';
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  openFilterModal(content): void {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.processModalAction();
        },
        (reason) => {
          this.discardFilters();
        }
      );
  }

  openOrderingModal(orders): void {
    this.modalService
      .open(orders, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.order = result;
          this.processModalAction();
        },
        (reason) => {
          this.discardFilters();
        }
      );
  }

  openMoreToolsModal(orders): void {
    this.modalService
      .open(orders, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }

  openErrorPatternModal(orders): void {
    this.modalService
      .open(orders, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.saveFilters();
          this.getErrorPatterns();
        },
        (reason) => {
          this.discardFilters();
        }
      );
  }

  processModalAction(): void {
    this.saveFilters();
    this.page = 0;
    this.sendToChild(this.clearCharts, true);
    this.sendToChild(this.updateFilters, this.filters);
    if (this.files.length === 1) {
      this.getData();
    } else {
      this.getErrorMetricsData();
    }
  }

  scrollHandler(): void {
    this.page += 1;
    if (this.files.length === 1) {
      this.getData();
    } else {
      this.getComparisonData();
    }
  }

  public refresh(): void {
    this.deleteFiles();
    this.discardFilters();
    this.filters.threshold = null;
    this.thresholdValue = 10;
    this.sendToChild(this.updateFilters, this.filters);
    this.sendToChild(this.clearCharts, true);
    this.sendToChild(this.eventData, { countryEvents: [] });
    this.hasDisplayedData = false;
    this.hasDisplayedErrorData = false;
  }

  public setToken(token): void {
    localStorage.setItem('token', token);
  }

  public deleteFiles(): void {
    for (const file of this.files) {
      this.api.deleteFile(file).subscribe((response) => {
        this.setToken(response.token);
      });
    }
    this.files = [];
  }

  public handleFileInput(files: FileList): void {
    this.files.push(files[0].name);
    this.uploadFile(files);

    this.fileInput.nativeElement.value = '';
  }

  public handleComparisonInput(files: FileList): void {
    this.sendToChild(this.clearCharts, true);
    this.page = 0;
    this.files.push(files[0].name);
    this.api.uploadFile(files).subscribe((response) => {
      this.setToken(response.token);
      this.files[1] = response.filename;
      this.getErrorMetricsData();
    });
  }

  public handleEventsInput(files: FileList): void {
    this.sendToChild(this.clearCharts, true);
    this.page = 0;
    this.api.uploadFile(files).subscribe((response) => {
      this.setToken(response.token);
      this.events = response.filename;
      this.getEventsData();
    });
  }

  public uploadFile(file): void {
    this.api.uploadFile(file).subscribe((response) => {
      this.setToken(response.token);
      this.files[0] = response.filename;
      this.getData();
    });
  }

  sendToChild(subject, changes): void {
    subject.next(changes);
  }

  getData(): void {
    this.api
      .getSegmentedData(this.files[0], this.page, 8, this.filters)
      .subscribe((res) => {
        this.dataResponse = SegmentedTimelineDataResponse.fromJSON(res);
        this.countries = this.dataResponse.countries;
        this.devices = this.dataResponse.devices;
        this.segments = [];
        this.dataResponse.data.forEach((item) => this.segments.push(item));
        this.sendToChild(this.updateCharts, this.segments);
        this.hasDisplayedData = true;
      });
  }

  getComparisonData(): void {
    this.api
      .getComparisonData(
        this.files[0],
        this.files[1],
        this.page,
        8,
        this.filters
      )
      .subscribe((res) => {
        const compareResponse = SegmentedTimelineCompareResponse.fromJSON(res);
        this.sendToChild(this.compareData, compareResponse);
        this.hasDisplayedData = true;
      });
  }

  getErrorMetricsData(): void {
    this.api
      .getErrorMetricsData(this.files[0], this.files[1], this.filters)
      .subscribe((res) => {
        const compareResponse = SegmentedDataErrorResponse.fromJSON(res);
        this.hasDisplayedErrorData = true;
        this.sendToChild(this.errorData, compareResponse);

        if (this.filters.threshold) {
          this.getErrorPatterns();
        }
        this.getComparisonData();
      });
  }

  getEventsData(): void {
    this.api.getEventsData(this.events, this.filters).subscribe((res) => {
      const eventsResponse = CountryEventsResponse.fromJSON(res);
      this.sendToChild(this.eventData, eventsResponse);
      if (this.files.length === 1) {
        this.getData();
      } else {
        this.getErrorMetricsData();
      }
    });
  }

  getErrorPatterns(): void {
    this.api
      .getErrorPatterns(this.files[0], this.files[1], this.filters)
      .subscribe((res) => {
        const patterns = ErrorPatternResponse.fromJSON(res);
        this.sendToChild(this.errorPatterns, patterns);
      });
  }

  saveFilters(): void {
    this.filters.device = this.selectedDeviceId;
    this.filters.countries = this.selectedCountryIds;
    this.filters.toDate = this.toDate;
    this.filters.fromDate = this.fromDate;
    this.filters.timePeriod = this.selectedTimePeriodId;
    this.filters.order = this.order;
    this.filters.threshold = this.thresholdValue;
  }

  discardFilters(): void {
    this.selectedDeviceId = this.filters.device;
    this.selectedCountryIds = this.filters.countries;
    this.fromDate = this.filters.fromDate;
    this.toDate = this.filters.toDate;
    this.selectedTimePeriodId = this.filters.timePeriod;
    this.order = this.filters.order;
    this.thresholdValue = this.filters.threshold;
  }
}
