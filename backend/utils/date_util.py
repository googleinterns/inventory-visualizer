from google.protobuf.timestamp_pb2 import Timestamp
from datetime import datetime


def string_to_timestamp_format(date, format='%Y-%m-%d'):
    timestamp = Timestamp()
    timestamp.FromDatetime(datetime.strptime(date, format))
    return timestamp


def seconds_to_timestamp(seconds):
    timestamp = Timestamp()
    timestamp.FromSeconds(seconds)
    return timestamp

def datetime_to_timestamp(datetime):
    timestamp = Timestamp()
    timestamp.FromDatetime(datetime)
    return timestamp