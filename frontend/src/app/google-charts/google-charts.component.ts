import {
  AfterViewInit,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChartsUtil } from './charts-util';

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
  @Input() events: Subject<any> = new Subject();
  @Input() patterns: Subject<any> = new Subject();
  @Output() scrolled = new EventEmitter<number>();
  charts = [];
  patternsChart = [];
  segmentedErrors = [];
  countryEvents = [];
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
    this.displayErrorPatterns();
    this.events.subscribe((v) => {
      this.countryEvents = v.countryEvents;
    });
    this.clear.subscribe((v) => {
      this.segmentedErrors = [];
      this.charts = [];
      let error_div = document.getElementById('chart_div');
      while (error_div.firstChild) {
        error_div.removeChild(error_div.firstChild);
      }
      let pattern_div = document.getElementById('pattern_chart');
      while (pattern_div.firstChild) {
        pattern_div.removeChild(pattern_div.firstChild);
      }
    });
  }

  addChartVisualizations(): void {
    this.changing.subscribe((v) => {
      for (const chart of v) {
        const newData = [];
        const countryEvents = ChartsUtil.getEventsForCountry(
          chart.country,
          this.countryEvents
        );
        let eventsIndex = ChartsUtil.getFirstEventIndex(chart, countryEvents);
        for (let i = 0; i < chart.dates.length; i++) {
          const values = [chart.inventoryVolumes[i]];
          const tooltip = ChartsUtil.buildTooltip(
            ChartsUtil.buildDateForCharts(chart.dates[i], this.appliedFilters),
            values,
            ['file1']
          );
          const eventAnnotations = ChartsUtil.getEventAnnotation(
            chart.dates[i],
            countryEvents,
            eventsIndex,
            this.appliedFilters
          );
          eventsIndex = eventAnnotations[2];
          newData.push([
            chart.dates[i],
            eventAnnotations[0],
            eventAnnotations[1],
            tooltip,
            chart.inventoryVolumes[i],
          ]);
        }
        this.addToCharts(
          [
            { type: 'date' },
            { type: 'string', role: 'annotation' },
            { type: 'string', role: 'annotationText' },
            { role: 'tooltip', type: 'string', p: { html: true } },
            'file1',
          ],
          newData,
          chart.country + ' ' + chart.device
        );
      }

      this.spinner.hide();
    });
  }

  addComparisonVisualizations(): void {
    this.compare.subscribe((v) => {
      const original = v.originalData.data;
      const comparison = v.comparisonData.data;
      for (let j = 0; j < original.length; j++) {
        const dataTable = [];
        const segmentError = ChartsUtil.getErrorForSegment(
          original[j],
          this.segmentedErrors
        );
        const countryEvents = ChartsUtil.getEventsForCountry(
          original[j].country,
          this.countryEvents
        );
        let eventsIndex = ChartsUtil.getFirstEventIndex(
          original[j],
          countryEvents
        );
        let originalIndex = 0;
        let comparisonIndex = 0;
        let errorIndex = ChartsUtil.getFirstErrorIndex(
          original[j],
          segmentError
        );
        while (
          originalIndex < original[j].dates.length &&
          comparisonIndex < comparison[j].dates.length
        ) {
          let column = [];
          const values = [];
          const currentDate =
            original[j].dates[originalIndex].getTime() <
            comparison[j].dates[comparisonIndex].getTime()
              ? original[j].dates[originalIndex]
              : comparison[j].dates[comparisonIndex];
          column.push(currentDate);
          originalIndex += this.addValueForCurrentDate(
            currentDate,
            values,
            original[j].dates[originalIndex],
            original[j].inventoryVolumes[originalIndex]
          );
          comparisonIndex += this.addValueForCurrentDate(
            currentDate,
            values,
            comparison[j].dates[comparisonIndex],
            comparison[j].inventoryVolumes[comparisonIndex]
          );
          if (segmentError) {
            errorIndex += this.addValueForCurrentDate(
              currentDate,
              values,
              segmentError.dates[errorIndex],
              segmentError.error[errorIndex]
            );
          }
          const eventAnnotations = ChartsUtil.getEventAnnotation(
            currentDate,
            countryEvents,
            eventsIndex,
            this.appliedFilters
          );
          eventsIndex = eventAnnotations[2];
          column.push(eventAnnotations[0], eventAnnotations[1]);
          column.push(
            ChartsUtil.buildTooltip(
              ChartsUtil.buildDateForCharts(currentDate, this.appliedFilters),
              values,
              ['file1', 'file2', 'error']
            )
          );
          column = column.concat(values);
          dataTable.push(column);
        }
        this.addRemainingValues(
          dataTable,
          countryEvents,
          eventsIndex,
          original[j],
          originalIndex,
          0
        );
        this.addRemainingValues(
          dataTable,
          countryEvents,
          eventsIndex,
          comparison[j],
          comparisonIndex,
          1
        );
        this.addToCharts(
          [
            { type: 'date' },
            { type: 'string', role: 'annotation' },
            { type: 'string', role: 'annotationText' },
            { role: 'tooltip', type: 'string', p: { html: true } },
            'file1',
            'file2',
            'error',
          ],
          dataTable,
          original[j].country + ' ' + original[j].device
        );
      }
      this.spinner.hide();
    });
  }

  addValueForCurrentDate(currentDate, data, segmentDate, value): number {
    if (currentDate.getTime() === segmentDate.getTime()) {
      data.push(value);
      return 1;
    }
    data.push(null);
    return 0;
  }

  addRemainingValues(
    dataTable,
    countryEvents,
    eventsIndex,
    segment,
    index,
    position
  ): void {
    while (index < segment.dates.length) {
      const values = [null, null, null];
      values[position] = segment.inventoryVolumes[index];
      const eventAnnotations = ChartsUtil.getEventAnnotation(
        segment.dates[index],
        countryEvents,
        eventsIndex,
        this.appliedFilters
      );
      eventsIndex = eventAnnotations[2];
      const column = [
        segment.dates[index],
        eventAnnotations[0],
        eventAnnotations[1],
        ChartsUtil.buildTooltip(
          ChartsUtil.buildDateForCharts(
            segment.dates[index],
            this.appliedFilters
          ),
          values,
          ['file1', 'file2', 'error']
        ),
      ].concat(values);
      dataTable.push(column);
      index++;
    }
  }

  addErrorVisualization(): void {
    this.error.subscribe((v) => {
      this.segmentedErrors = v.errors;
      this.plotErrors(v.errors);
    });
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

  displayErrorPatterns(): void {
    this.patterns.subscribe((v) => {
      const data = [];
      for (let i = 0; i < v.dates.length; i++) {
        const tooltip = ChartsUtil.buildTooltip(
          ChartsUtil.buildDateForCharts(v.dates[i], this.appliedFilters),
          [v.oddsForLargeError[i]],
          ['Odds for error']
        );
        data.push([v.dates[i], v.oddsForLargeError[i], tooltip]);
      }
      this.addErrorPatternLineChart(data);
    });
  }

  addErrorPatternLineChart(data): void {
    const dataTable = new google.visualization.DataTable();
    dataTable.addColumn('date', 'date');
    dataTable.addColumn('number', 'Odds of error bigger than threshold');
    dataTable.addColumn({ type: 'string', role: 'tooltip', p: { html: true }});
    dataTable.addRows(data);

    const chart = new google.visualization.LineChart(
      document.getElementById('pattern_chart')
    );

    chart.draw(dataTable, {
      title: 'Error Patterns',
      height: window.innerHeight,
      width: window.innerWidth,
      legend: { position: 'none' },
      tooltip: { isHtml: true },
      hAxis: { format: 'MMM yyyy', gridlines: { color: '#fff' } },
      vAxes: {
        0: { title: 'Odds for error %' },
      },
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
        hAxis: { format: 'MMM yyyy', gridlines: { color: '#fff' } },
        width: window.innerWidth,
        height: window.innerHeight * 0.25,
        focusTarget: 'category',
        tooltip: { isHtml: true },
        annotations: {
          style: 'line',
        },
      },
    };
    this.charts.push(current);
  }

  plotErrors(errors): void {
    const data = [];
    for (const error of errors) {
      if (ChartsUtil.shouldBeDisplayed(error, this.appliedFilters)) {
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
