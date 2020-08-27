import csv
from google.protobuf.timestamp_pb2 import Timestamp
from datetime import datetime
from grpc.messages import data_pb2

saved_data = {}


def add_data(segment, date, inventory):
    timestamp = Timestamp()
    timestamp.FromDatetime(datetime.strptime(date, '%Y-%m-%d'))
    segment.dates.append(timestamp)
    segment.inventory_volumes.append(int(inventory))


def get_data(filename):
    countries = set()
    devices = set()
    segments_to_data = {}
    if (filename in saved_data):
        return saved_data[filename][0], saved_data[filename][1], saved_data[filename][2]
    with open(filename) as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            countries.add(row['country'])
            devices.add(row['device'])
            if (row['country'], row['device']) not in segments_to_data:
                segments_to_data[(row['country'], row['device'])] = data_pb2.SegmentData(country=row['country'],
                                                                                         device=row['device'])
            add_data(segments_to_data[(row['country'], row['device'])], row['date'], row['impressions'])
    saved_data[filename] = (segments_to_data, countries, devices)
    return segments_to_data, countries, devices
