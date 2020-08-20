from google.protobuf.json_format import MessageToDict
from grpc.messages import data_pb2
import config
from flask_restful import Resource
from flask import request, abort
import os
from werkzeug.utils import secure_filename
from filters.data_filter import DataFilter
from data_reader import get_data
from numpy import percentile, asarray

error_importance_by_files = {}


def get_error(segment1, segment2):
    error = data_pb2.SegmentedDataError(country=segment1.country, device=segment1.device)
    index1, index2 = get_index_with_first_difference(segment1, segment2)
    while index1 != -1:
        value1 = segment1.inventory_volumes[index1]
        value2 = segment2.inventory_volumes[index2]
        if value1 != 0:
            current_error = (value2 - value1) / value1
            error.error.append(current_error)
            error.dates.append(segment1.dates[index1])
        index1 = index1 + 1
        index2 = index2 + 1
        index1, index2 = get_next_same_date_indexes(segment1.dates, segment2.dates, index1, index2)
    error.min = min(error.error)
    error.max = max(error.error)
    quartiles = percentile(asarray(error.error), [25, 50, 75])
    error.first_quartile = quartiles[0]
    error.median = quartiles[1]
    error.third_quartile = quartiles[2]
    return error


def get_index_with_first_difference(segment1, segment2):
    index1, index2 = get_next_same_date_indexes(segment1.dates, segment2.dates, 0, 0)
    if index1 == -1:
        return -1, -1
    while segment1.inventory_volumes[index1] == segment2.inventory_volumes[index2]:
        index1, index2 = get_next_same_date_indexes(segment1.dates, segment2.dates, index1, index2)
        if index1 == -1:
            return -1, -1
    return index1, index2


def get_next_same_date_indexes(dates1, dates2, index1, index2):
    if index1 >= len(dates1) or index2 >= len(dates2):
        return -1, -1
    if dates1[index1].seconds == dates2[index2].seconds:
        return index1, index2
    if dates1[index1].seconds < dates2[index2].seconds:
        return get_next_same_date_indexes(dates1, dates2, index1 + 1, index2)
    return get_next_same_date_indexes(dates1, dates2, index1, index2 + 1)


class Error(Resource):
    def get(self, filename1, filename2):
        data1, _ = get_data(os.path.join(config.UPLOAD_FOLDER, secure_filename(filename1)))
        data2, _ = get_data(os.path.join(config.UPLOAD_FOLDER, secure_filename(filename2)))
        errors = sorted([get_error(data1[tuple], data2[tuple]) for tuple in data1.keys()], key=lambda x: x.median,
                        reverse=True)
        error_importance_by_files[(filename1, filename2)] = [(error.country, error.device) for error in errors]
        response = data_pb2.SegmentedDataErrorResponse(errors=errors)
        return MessageToDict(response)


class Comparator(Resource):
    def get(self, original_filename, filename_for_comparison):
        try:
            page = int(request.args.get('page')) if request.args.get('page') else 0
            per_page = int(request.args.get('per_page')) if request.args.get('per_page') else config.per_page
        except ValueError:
            abort(400, 'page and per_page values should be numbers')
        filename1 = secure_filename(original_filename)
        filename2 = secure_filename(filename_for_comparison)
        original_data, original_file_countries = get_data(
            os.path.join(config.UPLOAD_FOLDER, filename1))
        comparison_data, comparison_file_countries = get_data(
            os.path.join(config.UPLOAD_FOLDER, filename2))
        data_filter = DataFilter(request.args)
        filtered_original_data = data_filter.filter(original_data)
        filtered_comparison_data = data_filter.filter(comparison_data)

        original_segmented_timeline_data = data_pb2.SegmentedTimelineDataResponse()
        comparison_segmented_timeline_data = data_pb2.SegmentedTimelineDataResponse()

        if (filename1, filename2) in error_importance_by_files:
            error_importance = error_importance_by_files[(filename1, filename2)]
            sorted_segment_keys_by_importance = [segment_key for segment_key in error_importance if
                                                 segment_key in filtered_original_data.keys()]
            sorted_segment_keys_by_importance_for_page = sorted_segment_keys_by_importance[
                                                         (page * per_page):(page * per_page + per_page)]
            original_segmented_timeline_data.data.extend(
                [filtered_original_data[key] for key in sorted_segment_keys_by_importance_for_page])
            comparison_segmented_timeline_data.data.extend(
                [filtered_comparison_data[key] for key in sorted_segment_keys_by_importance_for_page])
        else:
            original_segmented_timeline_data.data.extend(
                list(filtered_original_data.values())[(page * per_page):(page * per_page + per_page)])
            comparison_segmented_timeline_data.data.extend(
                list(filtered_comparison_data.values())[(page * per_page):(page * per_page + per_page)])

        response = data_pb2.SegmentedTimelineCompareResponse(original_data=original_segmented_timeline_data,
                                                             comparison_data=comparison_segmented_timeline_data)
        return MessageToDict(response)
