import config


def get_error_significance_score(value1, value2, distance_in_the_future, time_period):
    """

    This method takes two values and calculates the absolute error between them. After that
    it adjusts the importance of the error. The weight for each error depends on how far into
    the future the date of the error is - the furthers into the future, the less significant.

    :param value1: int First value
    :param value2: int Second value
    :param distance_in_the_future: int Distance into the future
    :param time_period: string What that distance is measured in (day, week, month)
    :return: int Weighted error
    """
    period_with_error_significance = config.error_significance_by_time_period[time_period]
    if distance_in_the_future >= period_with_error_significance:
        return 0
    weight = 1
    if distance_in_the_future != 1:
        weight = (period_with_error_significance - 1 - distance_in_the_future) / (
                period_with_error_significance - distance_in_the_future)
    error = abs(value2 - value1) / value1
    return weight * error
