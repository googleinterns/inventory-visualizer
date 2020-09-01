import {
  AfterViewInit,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { SegmentedDataError } from '../proto/protobuf/data';

@Component({
  selector: 'app-google-charts',
  templateUrl: './google-charts.component.html',
  styleUrls: ['./google-charts.component.css'],
})
export class GoogleChartsComponent implements AfterViewInit {
  @Input() changing: Subject<any> = new Subject();
  @Input() compare: Subject<any> = new Subject();
  @Input() error: Subject<any> = new Subject();
  @Input() clear: Subject<any> = new Subject();
  @Input() filters: Subject<any> = new Subject();
  @Output() scrolled = new EventEmitter<number>();
  charts = [];
  segmentedErrors = [];
  appliedFilters = null;
  constructor(private spinner: NgxSpinnerService) {}

  onScroll(): void {
    this.spinner.show();
    this.scrolled.emit();
  }

  ngAfterViewInit(): void {
    this.addChartVisualizations();
    this.addComparisonVisualizations();
    this.addErrorVisualization();
    this.filterErrorVisualization();
    this.clear.subscribe((v) => {
      this.charts = [];
    });
  }

  addChartVisualizations(): void {
    this.changing.subscribe((v) => {
      for (const chart of v) {
        const newData = [];
        for (let i = 0; i < chart.dates.length; i++) {
          const day = chart.dates[i].getDay() + 1;
          const month = chart.dates[i].toLocaleString('default', {
            month: 'short',
          });
          const year = chart.dates[i].getFullYear();
          newData.push([
            this.buildDateForCharts(chart.dates[i]),
            chart.inventoryVolumes[i],
          ]);
        }
        this.addToCharts(
          ['Date', 'file1'],
          newData,
          chart.country + ' ' + chart.device
        );
      }
      this.spinner.hide();
    });
  }

  buildDateForCharts(date): string {
    const day = date.getDate();
    const month = date.toLocaleString('default', {
      month: 'short',
    });
    const year = date.getFullYear();
    if (!this.appliedFilters || !this.appliedFilters.timePeriod) {
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 7);
      const day2 = nextDate.getDate();
      const month2 = nextDate.toLocaleString('default', {
        month: 'short',
      });
      const year2 = nextDate.getFullYear();
      return (
        day.toString() +
        ' ' +
        month +
        ' ' +
        year.toString() +
        ' - ' +
        day2.toString() +
        ' ' +
        month2 +
        ' ' +
        year2.toString()
      );
    }
    if (this.appliedFilters.timePeriod === 'month') {
      return month + ' ' + year.toString();
    }
    return day.toString() + ' ' + month + ' ' + year.toString();
  }

  addComparisonVisualizations(): void {
    this.compare.subscribe((v) => {
      const original = v.originalData.data;
      const comparison = v.comparisonData.data;
      for (let j = 0; j < original.length; j++) {
        const dataTable = [];
        const segmentError = this.getErrorForSegment(original[j]);
        let originalIndex = 0;
        let comparisonIndex = 0;
        let errorIndex = this.getFirstErrorIndex(original[j], segmentError);
        while (
          originalIndex < original[j].dates.length &&
          comparisonIndex < comparison[j].dates.length
        ) {
          const column = [];
          const currentDate =
            original[j].dates[originalIndex].getTime() <
            comparison[j].dates[comparisonIndex].getTime()
              ? original[j].dates[originalIndex]
              : comparison[j].dates[comparisonIndex];
          column.push(this.buildDateForCharts(currentDate));
          originalIndex += this.addValueForCurrentDate(
            currentDate,
            column,
            original[j].dates[originalIndex],
            original[j].inventoryVolumes[originalIndex]
          );
          comparisonIndex += this.addValueForCurrentDate(
            currentDate,
            column,
            comparison[j].dates[comparisonIndex],
            comparison[j].inventoryVolumes[comparisonIndex]
          );
          if (segmentError) {
            errorIndex += this.addValueForCurrentDate(
              currentDate,
              column,
              segmentError.dates[errorIndex],
              segmentError.error[errorIndex]
            );
          }
          dataTable.push(column);
        }
        this.addRemainingValues(dataTable, original[j], originalIndex);
        this.addRemainingValues(dataTable, comparison[j], comparisonIndex);
        this.addToCharts(
          ['Date', 'file1', 'file2', 'error'],
          dataTable,
          original[j].country + ' ' + original[j].device
        );
      }
      this.spinner.hide();
    });
  }

  getErrorForSegment(segment): SegmentedDataError {
    for (const error of this.segmentedErrors) {
      if (
        segment.country === error.country &&
        segment.device === error.device
      ) {
        return error;
      }
    }
    return null;
  }

  getFirstErrorIndex(segment, error): number {
    for (let i = 0; i < error.dates.length; i++) {
      if (error.dates[i].getTime() >= segment.dates[0].getTime()) {
        return i;
      }
    }
    return 0;
  }

  addValueForCurrentDate(currentDate, data, segmentDate, value): number {
    if (currentDate.getTime() === segmentDate.getTime()) {
      data.push(value);
      return 1;
    }
    data.push(null);
    return 0;
  }

  addRemainingValues(dataTable, segment, index): void {
    while (index < segment.dates.length) {
      dataTable.push([
        this.buildDateForCharts(segment.dates[index]),
        null,
        segment.inventoryVolumes[index],
        null,
      ]);
      index++;
    }
  }

  addErrorVisualization(): void {
    this.error.subscribe((v) => {
      this.segmentedErrors = v.errors;
      this.plotErrors(v.errors);
    });
  }

  shouldBeDisplayed(error): boolean {
    if (this.appliedFilters === null) {
      return true;
    }
    if (
      this.appliedFilters.countries &&
      this.appliedFilters.countries !== [] &&
      this.appliedFilters.countries.length !== 0 &&
      !this.appliedFilters.countries.includes(error.country)
    ) {
      return false;
    }
    if (
      this.appliedFilters.device != null &&
      this.appliedFilters.device !== error.device
    ) {
      return false;
    }
    return true;
  }

  filterErrorVisualization(): void {
    this.filters.subscribe((v) => {
      const data = [];
      this.appliedFilters = v;
      if (this.segmentedErrors !== [] && this.segmentedErrors.length !== 0) {
        this.plotErrors(this.segmentedErrors);
      }
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
          0: { targetAxisIndex: 0 },
          1: { targetAxisIndex: 0 },
          2: { targetAxisIndex: 1 },
        },
        vAxes: {
          // Adds titles to each axis.
          0: { title: 'Inventory' },
          1: { title: 'Error %' },
        },
        hAxis: { format: 'MMM yyyy' },
        width: window.innerWidth,
        height: window.innerHeight * 0.25,
        focusTarget: 'category',
      },
    };
    this.charts.push(current);
  }

  plotErrors(errors): void {
    const data = [];
    for (const error of errors) {
      if (this.shouldBeDisplayed(error)) {
        data.push([
          error.country + error.device,
          error.max,
          error.min,
          error.firstQuartile,
          error.median,
          error.thirdQuartile,
          error.max,
          error.min,
          error.firstQuartile,
          error.median,
          error.thirdQuartile,
        ]);
      }
    }
    this.addErrorBoxPlot(data);
  }

  addErrorBoxPlot(data): void {
    const dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'x');
    dataTable.addColumn('number', 'max');
    dataTable.addColumn('number', 'min');
    dataTable.addColumn('number', '25 Percentile');
    dataTable.addColumn('number', 'median');
    dataTable.addColumn('number', '75 Percentile');

    dataTable.addColumn({ id: 'max', type: 'number', role: 'interval' });
    dataTable.addColumn({ id: 'min', type: 'number', role: 'interval' });
    dataTable.addColumn({
      id: 'firstQuartile',
      type: 'number',
      role: 'interval',
    });
    dataTable.addColumn({ id: 'median', type: 'number', role: 'interval' });
    dataTable.addColumn({
      id: 'thirdQuartile',
      type: 'number',
      role: 'interval',
    });

    dataTable.addRows(data);

    const chart = new google.visualization.LineChart(
      document.getElementById('chart_div')
    );

    chart.draw(dataTable, {
      title: 'Error Metrics',
      height: window.innerHeight,
      width: window.innerWidth,
      legend: { position: 'none' },
      hAxis: {
        gridlines: { color: '#fff' },
      },
      lineWidth: 0,
      series: [{ color: '#D3362D' }],
      intervals: {
        style: 'boxes',
      },
      interval: {
        max: {
          style: 'bars',
          fillOpacity: 1,
          color: '#777',
        },
        min: {
          style: 'bars',
          fillOpacity: 1,
          color: '#777',
        },
      },
    });
  }
}
