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
        return {k: v for k, v in requested_filters.items() if k in self.filterDict}

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
    def filter_by_key(data, values, key_index):
        """
        This function filters a dictionary that has tuples for keys so that all keys have
        a value in position key_index that exists in a given set of values

        Parameters:
        data (dict): A dict that has (country, device) tuples for keys and data_pb2.SegmentData for values
        values (list): Allowed values for the tuple values in a given position
        key_index (int): The position in the tuples to look for the values

        Returns:
        dict: A dictionary that has (country, devices) as keys where all the values in the tuples in position
        key_index exist in the list values

        """
        keys = [tuple for tuple in data.keys() if tuple[key_index] in values]
        return {key: data[key] for key in keys}

    def filter_by_start_date(self, data, start_date):
        return self.filter_by_date(data, start_date, operator.ge)

    def filter_by_end_date(self, data, end_date):
        return self.filter_by_date(data, end_date, operator.le)

    @staticmethod
    def filter_by_date(data, bound_date, relation_comparator):
        new_data = {}
        for index, segment in data.items():
            keys = [i for i in range(len(segment.dates)) if
                    relation_comparator(segment.dates[i].seconds, int(bound_date))]
            dates = [segment.dates[key] for key in keys]
            inventory_volumes = [segment.inventory_volumes[key] for key in keys]
            filtered_segment = data_pb2.SegmentData(country=segment.country, device=segment.device, dates=dates,
                                                    inventory_volumes=inventory_volumes)
            new_data[index] = filtered_segment
        return new_data
