import unittest
from filters.time_period_grouper import group_segment_data_by_time_period
from datetime import datetime, timedelta
from tests.segment_set_up import get_generated_data
from calendar import monthrange


class TestTimePeriodGrouper(unittest.TestCase):

    def setUp(self):
        self.current_time = datetime.now()
        self.data = get_generated_data(self.current_time)

    def test_time_grouper_with_unallowed_time_period(self):
        time_period = 'not a time period'

        grouped_data = group_segment_data_by_time_period(self.data, time_period)

        for segment in grouped_data.values():
            self.assertFalse(segment.dates)
            self.assertFalse(segment.inventory_volumes)

    def test_daily_time_grouper(self):
        time_period = 'day'

        grouped_data = group_segment_data_by_time_period(self.data, time_period)

        self.assertDictEqual(self.data, grouped_data)

    def test_weekly_time_grouper_inventory_and_dates_length_match(self):
        time_period = 'week'

        grouped_data = group_segment_data_by_time_period(self.data, time_period)

        for tuple, segment in grouped_data.items():
            self.assertEqual(len(segment.inventory_volumes), len(segment.dates))

    def test_weekly_time_grouper_first_day_in_group(self):
        time_period = 'week'

        grouped_data = group_segment_data_by_time_period(self.data, time_period)

        for tuple, segment in grouped_data.items():
            for i in range(len(segment.dates) - 1):
                date = datetime.fromtimestamp(segment.dates[i].seconds)
                self.assertEqual(0, date.weekday())

    def test_weekly_time_grouper_days_in_between_dates(self):
        time_period = 'week'

        grouped_data = group_segment_data_by_time_period(self.data, time_period)

        for tuple, segment in grouped_data.items():
            for i in range(len(segment.dates) - 1):
                in_a_week = segment.dates[i].seconds + 60 * 60 * 24 * 7
                self.assertEqual(in_a_week, segment.dates[i + 1].seconds)

    def test_weekly_time_grouper_inventory_volumes_sum(self):
        time_period = 'week'

        grouped_data = group_segment_data_by_time_period(self.data, time_period)

        for tuple, segment in grouped_data.items():
            self.assertEqual(len(segment.inventory_volumes), len(segment.dates))
            for i in range(len(segment.dates) - 1):
                date_index_in_original_data = list(self.data[tuple].dates).index(segment.dates[i])
                inventory_volumes_sum = sum(
                    self.data[tuple].inventory_volumes[date_index_in_original_data:date_index_in_original_data + 7])
                self.assertEqual(inventory_volumes_sum, segment.inventory_volumes[i])

    def test_monthly_time_grouper_inventory_and_dates_length_match(self):
        time_period = 'month'

        grouped_data = group_segment_data_by_time_period(self.data, time_period)

        for tuple, segment in grouped_data.items():
            self.assertEqual(len(segment.inventory_volumes), len(segment.dates))

    def test_monthly_time_grouper_first_day_in_group(self):
        time_period = 'month'

        grouped_data = group_segment_data_by_time_period(self.data, time_period)

        for tuple, segment in grouped_data.items():
            self.assertEqual(len(segment.inventory_volumes), len(segment.dates))
            for i in range(len(segment.dates) - 1):
                date = datetime.fromtimestamp(segment.dates[i].seconds)
                self.assertEqual(1, date.day)

    def test_monthly_time_grouper_gap_between_dates(self):
        time_period = 'month'

        grouped_data = group_segment_data_by_time_period(self.data, time_period)

        for tuple, segment in grouped_data.items():
            self.assertEqual(len(segment.inventory_volumes), len(segment.dates))
            for i in range(len(segment.dates) - 1):
                date = datetime.fromtimestamp(segment.dates[i].seconds)
                days_in_current_month = monthrange(date.year, date.month)[1]
                in_a_month = segment.dates[i].seconds + 60 * 60 * 24 * days_in_current_month
                self.assertEqual(in_a_month, segment.dates[i + 1].seconds)

    def test_monthly_time_grouper_inventory_volumes_sum(self):
        time_period = 'month'

        grouped_data = group_segment_data_by_time_period(self.data, time_period)

        for tuple, segment in grouped_data.items():
            self.assertEqual(len(segment.inventory_volumes), len(segment.dates))
            for i in range(len(segment.dates) - 1):
                date = datetime.fromtimestamp(segment.dates[i].seconds)
                days_in_current_month = monthrange(date.year, date.month)[1]
                date_index_in_original_data = list(self.data[tuple].dates).index(segment.dates[i])
                inventory_volumes_sum = sum(
                    self.data[tuple].inventory_volumes[
                    date_index_in_original_data:date_index_in_original_data + days_in_current_month])
                self.assertEqual(inventory_volumes_sum, segment.inventory_volumes[i])


if __name__ == '__main__':
    unittest.main()
