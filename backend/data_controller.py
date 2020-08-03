from google.protobuf.json_format import MessageToDict
from grpc.messages import data_pb2
import config
from flask_restful import Resource
from flask import request, Flask
import csv
from google.protobuf.timestamp_pb2 import Timestamp
from datetime import datetime

saved_data = {}
app = Flask(__name__)


class Data(Resource):
    def get(self, filename):
        page = int(request.args.get('page')) if request.args.get('page') else 0
        per_page = int(request.args.get('per_page')) if request.args.get('per_page') else config.per_page
        if filename in saved_data:
            data = saved_data[filename]
        else:
            data = get_data(config.UPLOAD_FOLDER + '/' + filename)
            saved_data[filename] = data
        response = data_pb2.SegmentedTimelineDataResponse()
        response.data.extend(data.values()[(page * per_page):(page * per_page + per_page)])
        return MessageToDict(response)


def add_data(segment, date, inventory):
    timestamp = Timestamp()
    timestamp.FromDatetime(datetime.strptime(date, '%Y-%m-%d'))
    segment.dates.append(timestamp)
    segment.inventory_volumes.append(int(inventory))


def get_data(filename):
    segments_to_data = {}
    with open(filename) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        cursor = iter(csv_reader)
        # in order to skip the first line
        next(cursor)
        for row in cursor:
            if (row[1], row[2]) not in segments_to_data:
                segments_to_data[(row[1], row[2])] = data_pb2.SegmentData(country=row[1], device=row[2])
            add_data(segments_to_data[(row[1], row[2])], row[0], row[3])
    return segments_to_data
