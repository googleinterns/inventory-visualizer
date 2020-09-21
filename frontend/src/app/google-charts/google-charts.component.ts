import {
  AfterViewInit,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Subject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { SegmentedDataError, CountryEvents } from '../proto/protobuf/data';

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
  @Output() scrolled = new EventEmitter<number>();
  charts = [];
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
    this.events.subscribe((v) => {
      this.countryEvents = v.countryEvents;
    });
    this.clear.subscribe((v) => {
      this.segmentedErrors = [];
      this.charts = [];
      //this.countryEvents = [];
      let div = document.getElementById('chart_div');
      while (div.firstChild) {
        div.removeChild(div.firstChild);
      }
    });
  }

  addChartVisualizations(): void {
    this.changing.subscribe((v) => {
      for (const chart of v) {
        const newData = [];
        const countryEvents = this.getEventsForCountry(chart.country);
        let eventsIndex = this.getFirstEventIndex(chart, countryEvents);
        for (let i = 0; i < chart.dates.length; i++) {
          const values = [chart.inventoryVolumes[i]];
          const tooltip = this.buildTooltip(
            this.buildDateForCharts(chart.dates[i]),
            values,
            ['file1']
          );
          const eventAnnotations = this.getEventAnnotation(
            chart.dates[i],
            countryEvents,
            eventsIndex
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

  getEventAnnotation(currentDate, countryEvents, eventIndex): any[] {
    const result = [null, null, eventIndex];
    if (
      !countryEvents ||
      !countryEvents.events ||
      eventIndex >= countryEvents.events.length
    ) {
      return result;
    }
    const events = countryEvents.events;
    while (this.isInTimeframe(currentDate, events[eventIndex].start)) {
      if (!result[0]) {
        result[0] = '';
      }
      if (!result[1]) {
        result[1] = '';
      }
      result[0] += events[eventIndex].name + ' ';
      result[1] +=
        events[eventIndex].name +
        ' : ' +
        this.getTwoDateIntervalString(
          events[eventIndex].start,
          events[eventIndex].end
        );
      eventIndex++;
    }
    result[2] = eventIndex;
    return result;
  }

  isInTimeframe(timeframeStart, date): boolean {
    if (!this.appliedFilters || !this.appliedFilters.timePeriod) {
      const differenceInTime = date.getTime() - timeframeStart.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);
      return differenceInDays <= 6;
    }
    if (this.appliedFilters.timePeriod === 'month') {
      const month1 = timeframeStart.getMonth();
      const month2 = date.getMonth();
      return (
        month1 === month2 && date.getFullYear() === timeframeStart.getFullYear()
      );
    }
    return date.getTime() === timeframeStart.getTime();
  }

  buildTooltip(date, values, labels): string {
    let tooltip =
      '<div style="padding:5px 5px 5px 5px; display:table-row;"><b>' +
      date +
      '</b><table>';
    for (let i = 0; i < values.length; i++) {
      if (values[i] != null) {
        tooltip +=
          '<tr><td>' + labels[i] + ' : <b>' + values[i] + '</b></td></tr>';
      }
    }
    tooltip += '</table></div>';
    return tooltip;
  }

  buildDateForCharts(date): string {
    const month = date.toLocaleString('default', {
      month: 'short',
    });
    const year = date.getFullYear();
    if (!this.appliedFilters || !this.appliedFilters.timePeriod) {
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 7);
      return this.getTwoDateIntervalString(date, nextDate);
    }
    if (this.appliedFilters.timePeriod === 'month') {
      return month + ' ' + year.toString();
    }
    return this.getDateString(date);
  }

  getDateString(date): string {
    const day = date.getDate();
    const month = date.toLocaleString('default', {
      month: 'short',
    });
    const year = date.getFullYear();
    return day.toString() + ' ' + month + ' ' + year.toString();
  }

  getTwoDateIntervalString(date1, date2): string {
    if (date1.getTime() === date2.getTime()) {
      return this.getDateString(date1);
    }
    const day1 = date1.getDate();
    const month1 = date1.toLocaleString('default', {
      month: 'short',
    });
    const year1 = date1.getFullYear();
    const day2 = date2.getDate();
    const month2 = date2.toLocaleString('default', {
      month: 'short',
    });
    const year2 = date2.getFullYear();
    return (
      day1.toString() +
      ' ' +
      month1 +
      ' ' +
      year1.toString() +
      ' - ' +
      day2.toString() +
      ' ' +
      month2 +
      ' ' +
      year2.toString()
    );
  }

  addComparisonVisualizations(): void {
    this.compare.subscribe((v) => {
      const original = v.originalData.data;
      const comparison = v.comparisonData.data;
      for (let j = 0; j < original.length; j++) {
        const dataTable = [];
        const segmentError = this.getErrorForSegment(original[j]);
        const countryEvents = this.getEventsForCountry(original[j].country);
        let eventsIndex = this.getFirstEventIndex(original[j], countryEvents);
        let originalIndex = 0;
        let comparisonIndex = 0;
        let errorIndex = this.getFirstErrorIndex(original[j], segmentError);
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
          const eventAnnotations = this.getEventAnnotation(
            currentDate,
            countryEvents,
            eventsIndex
          );
          eventsIndex = eventAnnotations[2];
          column.push(eventAnnotations[0], eventAnnotations[1]);
          column.push(
            this.buildTooltip(this.buildDateForCharts(currentDate), values, [
              'file1',
              'file2',
              'error',
            ])
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

  getEventsForCountry(country): CountryEvents {
    for (const countryEvent of this.countryEvents) {
      if (country === countryEvent.country) {
        return countryEvent;
      }
    }
    return null;
  }

  getFirstEventIndex(segment, countryEvents): number {
    if (!countryEvents) {
      return -1;
    }
    for (let i = 0; i < countryEvents.events.length; i++) {
      console.log(countryEvents.events[i].start);
      if (
        countryEvents.events[i].start.getTime() >= segment.dates[0].getTime()
      ) {
        return i;
      }
    }
    return 0;
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
      const eventAnnotations = this.getEventAnnotation(
        segment.dates[index],
        countryEvents,
        eventsIndex
      );
      eventsIndex = eventAnnotations[2];
      const column = [
        segment.dates[index],
        eventAnnotations[0],
        eventAnnotations[1],
        this.buildTooltip(
          this.buildDateForCharts(segment.dates[index]),
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
