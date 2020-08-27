from google.protobuf.json_format import MessageToDict
from grpc.messages import data_pb2
import config
from flask_restful import Resource
from flask import request, abort
import os
from werkzeug.utils import secure_filename
from filters.data_filter import DataFilter
from data_reader import get_data


class Data(Resource):
    def get(self, filename):
        try:
            page = int(request.args.get('page')) if request.args.get('page') else 0
            per_page = int(request.args.get('per_page')) if request.args.get('per_page') else config.per_page
        except ValueError:
            abort(400, 'page and per_page values should be numbers')
        data_filter = DataFilter(request.args)
        filename = secure_filename(filename)
        data, countries = get_data(os.path.join(config.UPLOAD_FOLDER, filename))
        filtered_data = data_filter.filter(data)
        response = data_pb2.SegmentedTimelineDataResponse()
        response.data.extend(list(filtered_data.values())[(page * per_page):(page * per_page + per_page)])
        response.countries.extend(countries)
        return MessageToDict(response)
