from operator import attrgetter


def sort_alphabetically(data):
    return sorted(data, key=attrgetter('country', 'device'))


def sort_by_error_significance(data):
    return sorted(data, key=attrgetter('weighted_error_average'), reverse=True)


def sort_by_country_significance(data):
    significance_by_countries = get_country_significance(data)
    return sorted(data, key=lambda x: significance_by_countries[x.country], reverse=True)


def get_country_significance(data):
    significance_by_country = {}
    for segment in data:
        if segment.country not in significance_by_country:
            significance_by_country[segment.country] = 0
        significance_by_country[segment.country] = max(significance_by_country[segment.country],
                                                       segment.segment_significance)
    return significance_by_country


sorting_method_by_order_type = {
    'alphabetical': sort_alphabetically,
    'error_significance': sort_by_error_significance,
    'country_significance': sort_by_country_significance
}


def sort_data_by_order_type(data, order):
    """

    This function receives a list of either data_pb2.SegmentData or data_pb2.SegmentedDataError for values
    and sorts the segments according to the requested order

    :param data: list A list of either data_pb2.SegmentData or data_pb2.SegmentedDataError
    :param order: string A string that indicates the desired factor by which to order the data
    :return: list A list of data_pb2.SegmentData or data_pb2.SegmentedDataError sorted in he desired way
    """
    if order == 'unordered':
        return data
    return sorting_method_by_order_type[order](data)
