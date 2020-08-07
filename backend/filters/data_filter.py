import operator
from grpc.messages import data_pb2


class DataFilter:
    def __init__(self, requested_filters):
        self.filterDict = {
            'countries': self.filter_by_country,
            'devices': self.filter_by_device,
            'start_date': self.filter_by_start_date,
            'end_date': self.filter_by_end_date
        }
        self.filters = self.get_only_supported_filters(requested_filters)

    def get_only_supported_filters(self, requested_filters):
        return {supported: requested_filters[supported] for supported in self.filterDict.keys() if
                supported in requested_filters}

    def filter(self, data):
        for key, value in self.filters.items():
            data = self.filterDict[key](data, value)
        return data

    def filter_by_country(self, data, country_values):
        countries = country_values.split(',')
        return self.filter_by_key(data, countries, 0)

    def filter_by_device(self, data, device_values):
        devices = device_values.split(',')
        return self.filter_by_key(data, devices, 1)

    @staticmethod
    def filter_by_key(data, values, key):
        tuples = list(data.keys())
        keys = [i for i in tuples if i[key] in values]
        return {key: data[key] for key in keys}

    def filter_by_start_date(self, data, start_date):
        return self.filter_by_date(data, start_date, operator.ge)

    def filter_by_end_date(self, data, end_date):
        return self.filter_by_date(data, end_date, operator.le)

    @staticmethod
    def filter_by_date(data, bound_date, relation):
        for key, segment in data.items():
            keys = [key for key in range(len(segment.dates)) if relation(segment.dates[key].seconds, int(bound_date))]
            dates = [segment.dates[key] for key in keys]
            inventory_volumes = [segment.inventory_volumes[key] for key in keys]
            filtered_segment = data_pb2.SegmentData(country=segment.country, device=segment.device, dates=dates,
                                                    inventory_volumes=inventory_volumes)
            data[key] = filtered_segment
        return data
