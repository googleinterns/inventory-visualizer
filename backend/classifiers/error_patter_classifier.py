import config
from classifiers.error_significance_classifier import get_error_significance_score_util
from grpc.messages import data_pb2
from google.protobuf.timestamp_pb2 import Timestamp
from utils.date_util import seconds_to_timestamp


def get_error_patterns(segmented_errors, threshold):
    large_errors_per_date = {}

    for segmented_error in segmented_errors:
        for idx, error in enumerate(segmented_error.error):
            current_date = segmented_error.dates[idx]
            if current_date.seconds not in large_errors_per_date:
                large_errors_per_date[current_date.seconds] = (0, 0)
            large_errors, num_of_entries = large_errors_per_date[current_date.seconds]
            if abs(error) > threshold:
                large_errors += 1
            large_errors_per_date[current_date.seconds] = (large_errors, num_of_entries + 1)

    dates = sorted(large_errors_per_date.keys())
    odds_for_large_error = [(large_errors_per_date[date][0] / large_errors_per_date[date][1]) * 100 for date in dates]

    error_pattern = data_pb2.ErrorPatternResponse(dates=[seconds_to_timestamp(date) for date in dates],
                                                  odds_for_large_error=odds_for_large_error)
    return error_pattern
