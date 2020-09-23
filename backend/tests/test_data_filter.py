import config
import unittest
from grpc.messages import data_pb2
from random import randint
from datetime import datetime, timedelta
from filters.data_filter import DataFilter
from google.protobuf.timestamp_pb2 import Timestamp
from tests.segment_set_up import get_generated_data


class TestDataFilters(unittest.TestCase):

    def setUp(self):
        self.current_time = datetime.now()
        self.data = get_generated_data(self.current_time)

    def test_data_consistency_after_segment_filtering(self):
        filters = {'countries': 'US',
                   'devices': 'DO'}
        data_filter = DataFilter(filters)

        filtered_data = data_filter.filter(self.data)
        for tuple, segment in filtered_data.items():
            self.assertEqual(self.data[tuple], segment)

    def test_filter_by_country(self):
        filters = {'countries': 'US,ES'}
        data_filter = DataFilter(filters)

        filtered_data = data_filter.filter(self.data)

        countries_in_filtered_data = [tuple[0] for tuple in list(filtered_data.keys())]
        for country_in_filtered_data in countries_in_filtered_data:
            self.assertIn(country_in_filtered_data, ['US', 'ES'])

    def test_filter_by_segment(self):
        devices = ['MT', 'DO']
        for device in devices:
            filters = {'devices': device}
            data_filter = DataFilter(filters)
            filtered_data = data_filter.filter(self.data)
            devices_in_filtered_data = [tuple[1] for tuple in list(filtered_data.keys())]
            for device_in_filtered_data in devices_in_filtered_data:
                self.assertIn(device_in_filtered_data, [device])

    def test_filter_by_not_contained_device(self):
        filters = {'devices': 'not contained'}
        data_filter = DataFilter(filters)

        filtered_data = data_filter.filter(self.data)

        # empty dictionaries evaluate to False
        self.assertFalse(filtered_data)

    def test_filter_by_not_contained_country(self):
        filters = {'countries': 'not contained'}
        data_filter = DataFilter(filters)

        filtered_data = data_filter.filter(self.data)

        # empty dictionaries evaluate to False
        self.assertFalse(filtered_data)

    def test_filter_with_unexisting_filter_type(self):
        filters = {'unexisting': 'filter'}
        data_filter = DataFilter(filters)

        filtered_data = data_filter.filter(self.data)

        self.assertDictEqual(self.data, filtered_data)

    def test_filter_start_date_earlier_than_all_dates(self):
        filters = {'start_date': 0}
        data_filter = DataFilter(filters)

        filtered_data = data_filter.filter(self.data)

        self.assertDictEqual(self.data, filtered_data)

    def test_filter_start_date_later_than_all_dates(self):
        next_year = datetime.now() + timedelta(days=365)
        filters = {'start_date': next_year.timestamp()}
        data_filter = DataFilter(filters)

        filtered_data = data_filter.filter(self.data)

        for segment in filtered_data.values():
            self.assertFalse(segment.inventory_volumes)
            self.assertFalse(segment.dates)

    def test_filter_end_date_earlier_than_all_dates(self):
        filters = {'end_date': 0}
        data_filter = DataFilter(filters)

        filtered_data = data_filter.filter(self.data)

        for segment in filtered_data.values():
            self.assertFalse(segment.inventory_volumes)
            self.assertFalse(segment.dates)

    def test_filter_end_date_later_than_all_dates(self):
        next_year = datetime.now() + timedelta(days=365)
        filters = {'end_date': next_year.timestamp()}
        data_filter = DataFilter(filters)

        filtered_data = data_filter.filter(self.data)

        self.assertDictEqual(self.data, filtered_data)

    def test_filter_start_date_check_all_dates_are_bigger(self):
        time = (self.current_time + timedelta(days=randint(0, 10))).timestamp()
        filters = {'start_date': time}
        data_filter = DataFilter(filters)

        filtered_data = data_filter.filter(self.data)

        for segment in filtered_data.values():
            for date in segment.dates:
                self.assertGreater(date.seconds, time)

    def test_filter_end_date_check_all_dates_are_smaller(self):
        time = (self.current_time + timedelta(days=randint(0, 10))).timestamp()
        filters = {'end_date': time}
        data_filter = DataFilter(filters)

        filtered_data = data_filter.filter(self.data)

        for segment in filtered_data.values():
            for date in segment.dates:
                self.assertLess(date.seconds, time)


if __name__ == '__main__':
    unittest.main()
