from grpc.messages import data_pb2
import config
from numpy import percentile, asarray
import config
import os
from werkzeug.utils import secure_filename
from filters.data_filter import DataFilter
from utils.data_reader import get_data
from filters.time_period_grouper import group_segment_data_by_time_period


def get_error(segment1, segment2, time_period):
    """

    This function takes two segments as parameters, and starts iterating over their dates and
    inventory_volumes arrays in order to calculate the error. Since the segments can have information
    for different dates, the iteration is done by constantly aligning the next date for which the error
    is going to be calculated. The starting position of the error calculation is the first date
    that has produced a difference inn inventory_volumes as it is considered the first prediction.
    The error is calculated as (value2 - value1)/value2.

    :param segment1: data_pb2.SegmentedData This is the first segment
    :param segment2: data_pb2.SegmentedData This is the second segment
    :param time_period: string Time period by which the data is grouped
    :return: data_pb2.SegmentedDataError This is the object containing all error information
    """
    segment_significance = (segment1.segment_significance + segment2.segment_significance) / 2
    error = data_pb2.SegmentedDataError(country=segment1.country, device=segment1.device,
                                        segment_significance=segment_significance)
    index1, index2 = get_index_with_first_difference(segment1, segment2)
    weighted_errors = []
    while index1 != -1:
        value1 = segment1.inventory_volumes[index1]
        value2 = segment2.inventory_volumes[index2]
        if value1 != 0:
            current_error = ((value2 - value1) / value1) * 100
            error.error.append(current_error)
            error.dates.append(segment1.dates[index1])
            weighted_error = config.error_significance_function(value1, value2, len(error.error), time_period)
            if weighted_error != -1:
                weighted_errors.append(weighted_error)
        index1 = index1 + 1
        index2 = index2 + 1
        index1, index2 = get_first_same_date_indexes_in_sublists(segment1.dates, segment2.dates, index1, index2)
    error.min = min(error.error)
    error.max = max(error.error)
    quartiles = percentile(asarray(error.error), [25, 50, 75])
    error.first_quartile = quartiles[0]
    error.median = quartiles[1]
    error.third_quartile = quartiles[2]
    error.weighted_error_average = percentile(weighted_errors, [50])[0]
    return error


def get_index_with_first_difference(segment1, segment2):
    """

    This method gets two segments as parameters and starts iterating over their inventory_volumes
    in order to find the indices of the first date for which the volumes are different.
    Note that this method returns two indices as the same date may not correspond to the same index in the two arrays

    :param segment1: data_pb2.SegmentedData This is the first segment
    :param segment2: data_pb2.SegmentedData This is the second segment
    :return: int, int Two indices that mark the position of the first difference between the two arrays
    """
    index1, index2 = get_first_same_date_indexes_in_sublists(segment1.dates, segment2.dates, 0, 0)
    if index1 == -1:
        return -1, -1
    while segment1.inventory_volumes[index1] == segment2.inventory_volumes[index2]:
        index1, index2 = get_first_same_date_indexes_in_sublists(segment1.dates, segment2.dates, index1, index2)
        if index1 == -1:
            return -1, -1
    return index1, index2


def get_first_same_date_indexes_in_sublists(dates1, dates2, index1, index2):
    """

    This method get two lists of dates and two starting positions from respectively
    the first and the second dates lists. It then finds the closest date in time that
    is contained in both of the data lists from those two positions on and returns
    the indices of the found date for both of the arrays.

    :param dates1: list This is the first list with dates
    :param dates2: list This is the second list with dates
    :param index1: int This is the starting position for the first list
    :param index2: int This is the starting position for the second list
    :return: int, int Two indices representing the position of the first encountered matching date
    """
    if index1 >= len(dates1) or index2 >= len(dates2):
        return -1, -1
    if dates1[index1].seconds == dates2[index2].seconds:
        return index1, index2
    if dates1[index1].seconds < dates2[index2].seconds:
        return get_first_same_date_indexes_in_sublists(dates1, dates2, index1 + 1, index2)
    return get_first_same_date_indexes_in_sublists(dates1, dates2, index1, index2 + 1)


def get_error_by_files(filename1, filename2, time_period):
    data1, _, _ = get_data(os.path.join(config.UPLOAD_FOLDER, secure_filename(filename1)))
    data2, _, _ = get_data(os.path.join(config.UPLOAD_FOLDER, secure_filename(filename2)))
    data1 = group_segment_data_by_time_period(data1, time_period)
    data2 = group_segment_data_by_time_period(data2, time_period)
    return [get_error(data1[tuple], data2[tuple], time_period) for tuple in data1.keys()]
