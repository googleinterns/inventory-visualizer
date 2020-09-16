import operator
from grpc.messages import data_pb2
from datetime import datetime
from calendar import monthrange
from abc import ABCMeta, abstractmethod

class TimePeriodGrouperInterface:
    __metaclass__ = ABCMeta

    @abstractmethod
    def group(self, dates, values): raise NotImplemetedError

    @abstractmethod
    def get_time_period_component(self, date): raise NotImplementedError

    def get_first_period_beginning(self, dates):
        """

        This method takes a list of dates as a parameter and returns the index of the first date
        that is a beginning of a the time period.

        :param dates: list A list of dates
        :return: int The index of the first date that marks the beginning of the time period
        """
        for i, date in enumerate(dates):
            component = self.get_time_period_component(datetime.fromtimestamp(date.seconds))
            if component == 1:
                return i
        return -1

    def sum_values_by_amount_of_days(self, days, first_day, values):
        """

        This method receives a list of values and returns the sum of its values
        at positions that belong to the interval [first_day;first_day + days)

        :param days: int Size of the interval
        :param first_day: int First position
        :param values: list List of values whose sublist the methods sums up
        :return: int Sum of the values at positions between first_day and first_day + days in the list
        """
        return sum(values[first_day: first_day + days])


class WeekGrouper(TimePeriodGrouperInterface):
    def group(self, dates, values):
        index = self.get_first_period_beginning(dates)
        if index == -1:
            return [], []
        week_beginnings = []
        aggregated_values = []
        for i in range(index, len(dates) - 7, 7):
            week_beginnings.append(dates[i])
            aggregated_values.append(self.sum_values_by_amount_of_days(7, i, values))
        return week_beginnings, aggregated_values

    def get_time_period_component(self, date):
        return date.weekday() + 1

class MonthGrouper(TimePeriodGrouperInterface):
    def group(self, dates, values):
        index = self.get_first_period_beginning(dates)
        if index == -1:
            return [], []
        month_beginnings = []
        aggregated_values = []
        while index < len(dates):
            days_in_month = MonthGrouper.get_days_in_month(dates[index].seconds)
            if index + days_in_month <= len(dates):
                month_beginnings.append(dates[index])
                aggregated_values.append(self.sum_values_by_amount_of_days(days_in_month, index, values))
            index += days_in_month
        return month_beginnings, aggregated_values

    def get_time_period_component(self, date):
        return date.day

    @staticmethod
    def get_days_in_month(timestamp):
        """

        This method gets a date as a parameter. From its month and year
        this method gets and returns the number of days that make up
        the month.

        :param timestamp: google.protobuf.timestamp_pb2 The date that has information for the month and year
        :return: int Number of days that the month has
        """
        date = datetime.fromtimestamp(timestamp)
        return monthrange(date.year, date.month)[1]


period_groups = {
    'week': WeekGrouper,
    'month': MonthGrouper
}


def group_segment_data_by_time_period(data, time_period):
    """

    This function receives a dictionary with (country, device) tuples for keys and SegmentData for values.
    The data in each of this segments is then compressed. This is done by only saving the first day from the
    beginning of each time period ( eg. first ady of the week) and the sum of the inventory volumes for all of
    the days during this period.
    Note that time periods with incomplete information will bee omitted.

    :param data: dict A dict that has (country, device) tuples for keys and data_pb2.SegmentData for values
    :param time_period: string A string that indicates the length of the time period by which to group the data
    :return: dict  A dict that has (country, device) tuples for keys and data_pb2.SegmentData for values
    """
    if time_period == 'day':
        return data
    new_data = {}
    for tuple, segment in data.items():
        dates, values = group_by_time_period(segment.dates, segment.inventory_volumes, time_period)
        new_segment = data_pb2.SegmentData(country=segment.country, device=segment.device, dates=dates,
                                           inventory_volumes=values, segment_significance=segment.segment_significance)
        new_data[tuple] = new_segment
    return new_data


def group_by_time_period(dates, values, time_period):
    if time_period in period_groups:
        grouper = period_groups[time_period]()
        dates, values = grouper.group(dates, values)
        return dates, values
    return [], []
