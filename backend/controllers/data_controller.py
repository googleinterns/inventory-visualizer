from google.protobuf.json_format import MessageToDict
from grpc.messages import data_pb2
import config
from flask_restful import Resource
from flask import request, abort
import csv
import os
from werkzeug.utils import secure_filename
from google.protobuf.timestamp_pb2 import Timestamp
from datetime import datetime


class Data(Resource):
    def get(self, filename):
        try:
            page = int(request.args.get('page')) if request.args.get('page') else 0
            per_page = int(request.args.get('per_page')) if request.args.get('per_page') else config.per_page
        except ValueError:
            abort(400, 'page and per_page values should be a numbers')
        filename = secure_filename(filename)
        data = get_data(os.path.join(config.UPLOAD_FOLDER, filename))
        response = data_pb2.SegmentedTimelineDataResponse()
        response.data.extend(list(data.values())[(page * per_page):(page * per_page + per_page)])
        return MessageToDict(response)


def add_data(segment, date, inventory):
    timestamp = Timestamp()
    timestamp.FromDatetime(datetime.strptime(date, '%Y-%m-%d'))
    segment.dates.append(timestamp)
    segment.inventory_volumes.append(int(inventory))


def get_data(filename):
    segments_to_data = {}
    with open(filename) as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            if (row['country'], row['device']) not in segments_to_data:
                segments_to_data[(row['country'], row['device'])] = data_pb2.SegmentData(country=row['country'],
                                                                                         device=row['device'])
            add_data(segments_to_data[(row['country'], row['device'])], row['date'], row['impressions'])
    return segments_to_data
