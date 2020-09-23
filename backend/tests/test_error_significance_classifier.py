import unittest
import config
from classifiers.error_significance_classifier import get_error_significance_score
from random import randint


class TestErrorSignificance(unittest.TestCase):
    def test_get_error_significance_score_after_date_significance_limit(self):
        for time_period in config.allowed_time_periods:
            period_with_error_significance = config.error_significance_by_time_period[time_period]
            distance_in_the_future = period_with_error_significance
            self.assertEqual(get_error_significance_score(1, 1, distance_in_the_future, time_period), -1)

    def test_get_error_significance_score_with_day_in_the_past(self):
        for time_period in config.allowed_time_periods:
            self.assertEqual(get_error_significance_score(1, 1, -1, time_period), -1)

    def test_error_significance_takes_absolute_error_value(self):
        for time_period in config.allowed_time_periods:
            value1 = randint(1, 10)
            value2 = randint(11, 20)
            error1 = get_error_significance_score(value1, value2, 1, time_period)
            error2 = get_error_significance_score(value2, value1, 1, time_period)
            self.assertGreater(error1, 0)
            self.assertGreater(error2, 0)

    def test_get_error_significance_score_on_first_day(self):
        for time_period in config.allowed_time_periods:
            value1 = randint(1, 10)
            value2 = randint(11, 20)
            error = (abs(value2 - value1) / value1) * 100
            self.assertEqual(get_error_significance_score(value1, value2, 1, time_period), error)

    def test_get_error_significance_decline_over_time(self):
        for time_period in config.allowed_time_periods:
            value1 = randint(1, 10)
            value2 = randint(11, 20)
            previous_error_significance = get_error_significance_score(value1, value2, 1, time_period)
            period_with_error_significance = config.error_significance_by_time_period[time_period]
            for i in range(50, period_with_error_significance, 50):
                curr_error = get_error_significance_score(value1, value2, i, time_period)
                self.assertLess(curr_error, previous_error_significance)
                previous_error_significance = curr_error


if __name__ == '__main__':
    unittest.main()
