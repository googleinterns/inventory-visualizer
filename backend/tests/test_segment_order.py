import unittest
from orders.segment_order import sort_data_by_order_type
from datetime import datetime, timedelta
from tests.segment_set_up import get_generated_data
from calendar import monthrange
from random import randint
from grpc.messages import data_pb2


class TestTimePeriodGrouper(unittest.TestCase):

    def setUp(self):
        self.current_time = datetime.now()
        self.data = get_generated_data(self.current_time)
        self.errors = [data_pb2.SegmentedDataError(weighted_error_average=randint(0, 400)) for i in range(30)]

    def test_unordered_segment_order(self):
        order_type = 'unordered'

        ordered_segments = sort_data_by_order_type(self.data.values(), order_type)

        self.assertEqual(list(self.data.values()), list(ordered_segments))

    def test_alphabetical_segment_order(self):
        order_type = 'alphabetical'

        ordered_segments = sort_data_by_order_type(self.data.values(), order_type)

        sorted = all((ordered_segments[i].country, ordered_segments[i].device) <= (
            ordered_segments[i + 1].country, ordered_segments[i + 1].device) for i in
                     range(len(ordered_segments) - 1))

        self.assertTrue(sorted)

    def test_error_significance_segment_order(self):
        order_type = 'error_significance'

        ordered_errors = sort_data_by_order_type(self.errors, order_type)
        sorted = all(ordered_errors[i].weighted_error_average >= ordered_errors[i + 1].weighted_error_average for i in
                     range(len(ordered_errors) - 1))

        self.assertTrue(sorted)

    def test_country_significance_segment_order(self):
        order_type = 'country_significance'

        ordered_segments = sort_data_by_order_type(self.data.values(), order_type)

        idx_list = [idx + 1 for idx in range(len(ordered_segments) - 1) if
                    ordered_segments[idx].country != ordered_segments[idx + 1].country]
        start = 0
        max_per_country = []
        for i in idx_list:
            max_per_country.append(max([segment.segment_significance for segment in ordered_segments[start:i]]))
            start = i
        sorted = all(max_per_country[i] >= max_per_country[i + 1] for i in range(len(max_per_country) - 1))
        self.assertTrue(sorted)

    if __name__ == '__main__':
        unittest.main()
