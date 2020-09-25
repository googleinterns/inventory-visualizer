import unittest
from classifiers.error_patter_classifier import get_error_patterns
from datetime import datetime
from tests.segment_set_up import get_generated_error
import config


class TestErrorPattern(unittest.TestCase):

    def setUp(self):
        self.current_time = datetime.now()
        self.size = 100
        self.errors = get_generated_error(self.current_time, self.size)

    def test_get_error_pattern_with_negative_threshold(self):
        error_pattern = get_error_patterns(self.errors, -1)
        self.assertListEqual(list(error_pattern.odds_for_large_error), [100.0 for i in range(self.size)])


if __name__ == '__main__':
    unittest.main()
