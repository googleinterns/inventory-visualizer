from google.protobuf.json_format import MessageToDict
from grpc.messages import data_pb2
import config
from authentication.auth import ProtectedResource
from flask import request, abort
import os
from werkzeug.utils import secure_filename
from filters.data_filter import DataFilter
from data_reader import get_data
from filters.time_period_grouper import group_segment_data_by_time_period
from authentication import auth
from orders.segment_order import sort_data_by_order_type

class Data(ProtectedResource):

    def get(self, filename):
        try:
            page = int(request.args.get('page')) if request.args.get('page') else 0
            per_page = int(request.args.get('per_page')) if request.args.get('per_page') else config.per_page
        except ValueError:
            abort(400, 'page and per_page values should be numbers')
        data_filter = DataFilter(request.args)
        filename = secure_filename(filename)
        data, countries, devices = get_data(os.path.join(config.UPLOAD_FOLDER, filename))
        time_period = request.args.get('time_period') if request.args.get('time_period') else config.time_period
        grouped_data = group_segment_data_by_time_period(data, time_period)
        filtered_data = data_filter.filter(grouped_data)
        order_type = request.args.get('order_by') if request.args.get('order_by') else config.order_by
        ordered_data = sort_data_by_order_type(list(filtered_data.values()), order_type)
        response = data_pb2.SegmentedTimelineDataResponse()
        response.data.extend(ordered_data[(page * per_page):(page * per_page + per_page)])
        response.countries.extend(countries)
        response.devices.extend(devices)
        return MessageToDict(response)
