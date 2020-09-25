from random import randint
from grpc.messages import data_pb2
from datetime import timedelta
from google.protobuf.timestamp_pb2 import Timestamp
from utils.date_util import datetime_to_timestamp

devices = ['MT', 'DO']
countries = ['US', 'ES', 'BG']


def generate_dates_array(size, current_time):
    dates = []
    for i in range(size):
        dates.append(datetime_to_timestamp(current_time + timedelta(days=i)))
    return dates


def generate_random_array(size, min_value=0, max_value=100):
    array = []
    for i in range(size):
        array.append(randint(min_value, max_value))
    return array


def get_generated_data(current_time, size = 100):
    data = {}
    inventory_volumes = generate_random_array(size)
    dates = generate_dates_array(size, current_time)
    for country in countries:
        for device in devices:
            segment = data_pb2.SegmentData(country=country, device=device, segment_significance=randint(0, 100),
                                           inventory_volumes=inventory_volumes, dates=dates)
            data[(country, device)] = segment
    return data


def get_generated_error(current_time, size = 100):
    errors = []
    error = generate_random_array(size)
    dates = generate_dates_array(size, current_time)
    for country in countries:
        for device in devices:
            errors.append(
                data_pb2.SegmentedDataError(country=country, device=device, segment_significance=randint(0, 100),
                                            error=error, dates=dates))
    return errors
