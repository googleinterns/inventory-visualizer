from google.protobuf.json_format import MessageToDict
from grpc.messages import data_pb2
import config
from authentication.auth import ProtectedResource
from flask import request, abort
import os
from werkzeug.utils import secure_filename
from filters.data_filter import DataFilter
from utils.data_reader import get_data
from filters.time_period_grouper import group_segment_data_by_time_period
from orders.segment_order import sort_data_by_order_type
from utils.error_util import get_error_by_files

error_importance_by_files = {}


class Error(ProtectedResource):

    def get(self, filename1, filename2):
        time_period = request.args.get('time_period') if request.args.get('time_period') else config.time_period
        errors = get_error_by_files(filename1, filename2, time_period)
        order_type = request.args.get('order_by') if request.args.get('order_by') else config.error_order_by
        sorted_errors = sort_data_by_order_type(errors, order_type)
        error_importance_by_files[(filename1, filename2)] = [(error.country, error.device) for error in sorted_errors]
        response = data_pb2.SegmentedDataErrorResponse(errors=sorted_errors)
        return MessageToDict(response)


class Comparator(ProtectedResource):

    def get(self, original_filename, filename_for_comparison):
        try:
            page = int(request.args.get('page')) if request.args.get('page') else 0
            per_page = int(request.args.get('per_page')) if request.args.get('per_page') else config.per_page
        except ValueError:
            abort(400, 'page and per_page values should be numbers')
        filename1 = secure_filename(original_filename)
        filename2 = secure_filename(filename_for_comparison)
        original_data, _, _ = get_data(
            os.path.join(config.UPLOAD_FOLDER, filename1))
        comparison_data, _, _ = get_data(
            os.path.join(config.UPLOAD_FOLDER, filename2))
        time_period = request.args.get('time_period') if request.args.get('time_period') else config.time_period
        grouped_original_data = group_segment_data_by_time_period(original_data, time_period)
        grouped_comparison_data = group_segment_data_by_time_period(comparison_data, time_period)
        data_filter = DataFilter(request.args)
        filtered_original_data = data_filter.filter(grouped_original_data)
        filtered_comparison_data = data_filter.filter(grouped_comparison_data)

        original_segmented_timeline_data = data_pb2.SegmentedTimelineDataResponse()
        comparison_segmented_timeline_data = data_pb2.SegmentedTimelineDataResponse()

        if (filename1, filename2) not in error_importance_by_files:
            errors = sorted([get_error(original_data[tuple], comparison_data[tuple], time_period) for tuple in
                             original_data.keys()],
                            key=lambda x: x.median,
                            reverse=True)
            order_type = request.args.get('order_by') if request.args.get('order_by') else config.error_order_by
            sorted_errors = sort_data_by_order_type(errors, order_type)
            error_importance_by_files[(filename1, filename2)] = [(error.country, error.device) for error in
                                                                 sorted_errors]

        error_importance = error_importance_by_files[(filename1, filename2)]
        sorted_segment_keys_by_importance = [segment_key for segment_key in error_importance if
                                             segment_key in filtered_original_data.keys()]
        sorted_segment_keys_by_importance_for_page = sorted_segment_keys_by_importance[
                                                     (page * per_page):(page * per_page + per_page)]
        original_segmented_timeline_data.data.extend(
            [filtered_original_data[key] for key in sorted_segment_keys_by_importance_for_page])
        comparison_segmented_timeline_data.data.extend(
            [filtered_comparison_data[key] for key in sorted_segment_keys_by_importance_for_page])
        response = data_pb2.SegmentedTimelineCompareResponse(original_data=original_segmented_timeline_data,
                                                             comparison_data=comparison_segmented_timeline_data)
        return MessageToDict(response)
