from grpc.messages import data_pb2


def sort_events_by_start_date(countries_and_events):
    """

    This function receives a list of data_pb2.CountryEvents for values
    and sorts the events for each country chronologically by the start of the event

    :param countries_and_events: list A list of data_pb2.CountryEvents
    :return: list A list of data_pb2.CountryEvents with chronologically sorted events
    """
    sorted_countries_and_events = []
    for country_events in countries_and_events:
        sorted_events = sorted(country_events.events, key=lambda x: x.start.seconds)
        sorted_country_events = data_pb2.CountryEvents(country=country_events.country, events=sorted_events)
        sorted_countries_and_events.append(sorted_country_events)
    return sorted_countries_and_events
