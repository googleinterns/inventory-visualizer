import { SegmentedDataError, CountryEvents } from '../proto/protobuf/data';

export class ChartsUtil {
  /**
   *
   * This method generates an Event annotaion for a given time period. The time period is defined by a start date
   * and the type of the selected time period (day, week, month). The returned array consists of the name the annotation,
   * the annotation text and the reached postion in the events for the current country. The annotation name is what will be
   * displayed in the graph, whereas the annotation text is the on-hover tooltip for the annotation. The tooltio should
   * contain the names for each of the events for the current time period along with when it takes place.
   * The result returns nulls for annotation name and annotation text if no event takes place in the current time period.
   *
   * @param Date currentDate This is the date from which the time period starts in the visualization
   * @param CountryEvents countryEvents This object keeps information about the events per each country
   * @param number eventIndex This index is used to keep track of the reached position in the countryEvents list
   * @param object appliedFilters This object keeps information about the selected time period
   *
   * @returns any[] An array that contaisn annotation name, annotation text and reached countryEvents index
   */
  static getEventAnnotation(
    currentDate,
    countryEvents,
    eventIndex,
    appliedFilters
  ): any[] {
    const result = [null, null, eventIndex];
    if (
      !countryEvents ||
      !countryEvents.events ||
      eventIndex >= countryEvents.events.length
    ) {
      return result;
    }
    const events = countryEvents.events;
    while (
      this.isInTimeframe(currentDate, events[eventIndex].start, appliedFilters)
    ) {
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

  /**
   *
   * This method checks if a given date is within a time period. The time period is defined by a start date
   * and the type of the selected time period (day, week, month).
   *
   * @param Date timeframeStart The start date
   * @param Date date The date to be checked for, if it fits in the timeframe
   * @param object appliedFilters This object keeps information about the selected time period
   *
   * @return boolean Retursn true if date is within the timeframe and false otherwise.
   */
  static isInTimeframe(timeframeStart, date, appliedFilters): boolean {
    if (!appliedFilters || !appliedFilters.timePeriod) {
      const differenceInTime = date.getTime() - timeframeStart.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);
      return differenceInDays <= 6;
    }
    if (appliedFilters.timePeriod === 'month') {
      const month1 = timeframeStart.getMonth();
      const month2 = date.getMonth();
      return (
        month1 === month2 && date.getFullYear() === timeframeStart.getFullYear()
      );
    }
    return date.getTime() === timeframeStart.getTime();
  }

  /**
   *
   * This method genertes an html tooltip for a given date. The tooltip is created by
   * receiving two arrays of the same size - values and labels, where values[i] represents
   * the inventory volume size for datafile with label[i] for the given date.
   *
   * @param Date date
   * @param array values Array of inventory volumes
   * @param array labels Array of names for the labels
   *
   * @returns string Html div that contains the tooltip text
   */
  static buildTooltip(date, values, labels): string {
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

  /**
   *
   * This method generates a string representation of a time period. The time period is defined by a start date
   * and the type of the selected time period (day, week, month).
   *
   * @param Date date This is the beginning of the time period
   * @param object appliedFilters This object keeps information about the selected time period
   */
  static buildDateForCharts(date, appliedFilters): string {
    const month = date.toLocaleString('default', {
      month: 'short',
    });
    const year = date.getFullYear();
    if (!appliedFilters || !appliedFilters.timePeriod) {
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 7);
      return this.getTwoDateIntervalString(date, nextDate);
    }
    if (appliedFilters.timePeriod === 'month') {
      return month + ' ' + year.toString();
    }
    return this.getDateString(date);
  }

  /**
   *
   * This method takes a date as a parameter and returns its dd MMM yyyy string representation.
   *
   * @param Date date Date to be formatted
   *
   * @returns string String representation of date
   */
  static getDateString(date): string {
    const day = date.getDate();
    const month = date.toLocaleString('default', {
      month: 'short',
    });
    const year = date.getFullYear();
    return day.toString() + ' ' + month + ' ' + year.toString();
  }

  /**
   *
   * This method takes tow dates that define a time period and returns a string that represents it
   * in the format dd MMM yyyy - dd MMM yyyy
   *
   * @param Date date1 Start of tiem period
   * @param Date date2 End of time period
   *
   * @returns string The string representation of the time period
   */
  static getTwoDateIntervalString(date1, date2): string {
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

  /**
   *
   * This method reveices an error for a segment and based on the selected filters
   * returns whether it should be dispalyed or not.
   *
   * @param SegmentedDataError error Object that contains country and device
   * @param object appliedFilters Object that contains countries and devices that should be dispalyed
   */
  static shouldBeDisplayed(error, appliedFilters): boolean {
    if (appliedFilters === null) {
      return true;
    }
    if (
      appliedFilters.countries &&
      appliedFilters.countries !== [] &&
      appliedFilters.countries.length !== 0 &&
      !appliedFilters.countries.includes(error.country)
    ) {
      return false;
    }
    if (
      appliedFilters.device != null &&
      appliedFilters.device !== error.device
    ) {
      return false;
    }
    return true;
  }

  /**
   *
   * This metohd gets the current segement and a list of segmetnedErrors and returns
   * the segmentedError that matches the segment.
   *
   * @param object segment The current segment
   * @param array segmetnedErrors Array of SegmentedDataError
   *
   * @returns SegmentedDataError The segmented error that is for the wanted segment
   */
  static getErrorForSegment(segment, segmetnedErrors): SegmentedDataError {
    for (const error of segmetnedErrors) {
      if (
        segment.country === error.country &&
        segment.device === error.device
      ) {
        return error;
      }
    }
    return null;
  }

  /**
   *
   * This metohd gets the current country and a list of CountryEvents and returns
   * the countryEvent that matches the country.
   *
   * @param string country The current country
   * @param array countryEvents Array of CountryEvents
   *
   * @returns CountryEvents The events for the wanted country
   */
  static getEventsForCountry(country, countryEvents): CountryEvents {
    for (const countryEvent of countryEvents) {
      if (country === countryEvent.country) {
        return countryEvent;
      }
    }
    return null;
  }

  /**
   *
   * This method takes a segment and its events and finds the first event that
   * fits the timeframe data that there is for the segment.
   *
   * @param SegmentData segment The current segment
   * @param CountryEvents countryEvents All events for the segment
   *
   * @returns number Index of the first event in the array events of the CountryEvents object
   */
  static getFirstEventIndex(segment, countryEvents): number {
    if (!countryEvents) {
      return -1;
    }
    for (let i = 0; i < countryEvents.events.length; i++) {
      if (
        countryEvents.events[i].start.getTime() >= segment.dates[0].getTime()
      ) {
        return i;
      }
    }
    return 0;
  }

  /**
   *
   * This method takes a segment and its errors and finds the first error that
   * fits the timeframe data that there is for the segment.
   *
   * @param SegmentData segment The current segment
   * @param SegmentedDataError error All errors for the segment
   *
   * @returns number Index of the first event in the array events of the CountryEvents object
   */
  static getFirstErrorIndex(segment, error): number {
    for (let i = 0; i < error.dates.length; i++) {
      if (error.dates[i].getTime() >= segment.dates[0].getTime()) {
        return i;
      }
    }
    return 0;
  }
}
