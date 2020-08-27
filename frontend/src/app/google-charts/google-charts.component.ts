import {AfterViewInit, Component, Input, Output, EventEmitter} from '@angular/core';
import {Subject} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-google-charts',
  templateUrl: './google-charts.component.html',
  styleUrls: ['./google-charts.component.css']
})
export class GoogleChartsComponent implements AfterViewInit {

  @Input() changing: Subject<any> = new Subject();
  @Input() clear: Subject<any> = new Subject();
  @Input() filters: Subject<any> = new Subject();

  @Output() scrolled = new EventEmitter<number>();
  charts : any[];
  constructor(private spinner: NgxSpinnerService) {
    this.charts = [];
  }

  onScroll(): void {
    this.spinner.show();
    this.scrolled.emit();
  }

  ngAfterViewInit(): void {
    this.addChartVisualizations();
    this.clear.subscribe(v => {
      this.charts = [];
    });
  }

  addChartVisualizations(): void {
    this.changing.subscribe(v => {
      for (const chart of v) {
        const newData = [];
        for (let i = 0; i < chart.dates.length; i++) {
          newData.push([chart.dates[i], chart.inventoryVolumes[i]]);
        }
        this.addToCharts(['Date', 'file1'], newData, (chart.country + ' ' + chart.device));
      }
      this.spinner.hide();
    });
  }

  addToCharts(columns, data, title): void {
    const current = {
      title: title,
      type: 'LineChart',
      data: data,
      columns: columns,
      options: {
        series: {
          0: {targetAxisIndex: 0},
          1: {targetAxisIndex: 0},
          2: {targetAxisIndex: 1}
        },
        vAxes: {
          // Adds titles to each axis.
          0: {title: 'Inventory'},
          1: {title: 'Error %'}
        },
        width: window.innerWidth,
        height: window.innerHeight * 0.25
      }
    };
    this.charts.push(current);
  }

}
