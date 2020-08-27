import operator
from grpc.messages import data_pb2
from datetime import datetime
from calendar import monthrange


def group_by_week(dates, values):
    index = get_first_week_beginning(dates)
    if index == -1:
        return [], []
    week_beginnings = []
    aggregated_values = []
    for i in range(index, len(dates) - 7, 7):
        week_beginnings.append(dates[i])
        aggregated_values.append(sum_values_by_amount_of_days(7, i, values))
    return week_beginnings, aggregated_values


def group_by_month(dates, values):
    index = get_first_month_beginning(dates)
    if index == -1:
        return [], []
    month_beginnings = []
    aggregated_values = []
    while index < len(dates):
        days_in_month = get_days_in_month(dates[index].seconds)
        if index + days_in_month <= len(dates):
            month_beginnings.append(dates[index])
            aggregated_values.append(sum_values_by_amount_of_days(days_in_month, index, values))
        index += days_in_month
    return month_beginnings, aggregated_values


period_groups = {
    'week': group_by_week,
    'month': group_by_month
}


def group_segment_data_by_time_period(data, time_period):
    if time_period == 'day':
        return data
    new_data = {}
    for tuple, segment in data.items():
        dates, values = group_by_time_period(segment.dates, segment.inventory_volumes, time_period)
        new_segment = data_pb2.SegmentData(country=segment.country, device=segment.device, dates=dates,
                                           inventory_volumes=values)
        new_data[tuple] = new_segment
    return new_data


def group_by_time_period(dates, values, time_period):
    if time_period in period_groups:
        dates, values = period_groups[time_period](dates, value)
    return dates, values


def get_first_week_beginning(dates):
    for i, date in enumerate(dates):
        weekday = datetime.fromtimestamp(date.seconds).weekday()
        if weekday == 0:
            return i
    return -1


def get_first_month_beginning(dates):
    for i, date in enumerate(dates):
        day = datetime.fromtimestamp(date.seconds).day
        if day == 1:
            return i
    return -1


def get_days_in_month(timestamp):
    date = datetime.fromtimestamp(timestamp)
    return monthrange(date.year, date.month)[1]


def sum_values_by_amount_of_days(days, first_day, values):
    return sum(values[first_day: first_day + days])
