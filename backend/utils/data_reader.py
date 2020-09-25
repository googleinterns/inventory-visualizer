import csv
from grpc.messages import data_pb2
from utils.date_util import string_to_timestamp_format
saved_data = {}

def add_data(segment, date, inventory):
    timestamp = string_to_timestamp_format(date)
    segment.dates.append(timestamp)
    segment.inventory_volumes.append(int(inventory))
    segment.segment_significance = max(segment.segment_significance, int(inventory))


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
                                                                                         device=row['device'],
                                                                                         segment_significance=0)
            add_data(segments_to_data[(row['country'], row['device'])], row['date'], row['impressions'])
    saved_data[filename] = (segments_to_data, countries, devices)
    return segments_to_data, countries, devices


def get_events(filename):
    events_by_countries = {}
    if (filename in saved_data):
        return saved_data[filename]
    with open(filename) as csv_file:
        csv_reader = csv.DictReader(csv_file)
        for row in csv_reader:
            start = string_to_timestamp_format(row['start'])
            end = string_to_timestamp_format(row['end'])
            event = data_pb2.Event(name=row['name'], start=start, end=end)
            if (row['country']) not in events_by_countries:
                events_by_countries[row['country']] = data_pb2.CountryEvents(country=row['country'])
            events_by_countries[row['country']].events.append(event)
    saved_data[filename] = events_by_countries
    return events_by_countries
