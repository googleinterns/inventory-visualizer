from google.protobuf.json_format import MessageToDict
from grpc.messages import data_pb2
from authentication.auth import ProtectedResource
import os
from werkzeug.utils import secure_filename
from utils.data_reader import get_events
import config
from orders import event_order


class Events(ProtectedResource):

    def get(self, filename):
        filename = secure_filename(filename)
        countries_and_events = get_events(os.path.join(config.UPLOAD_FOLDER, filename))
        sorted_countries_and_events = event_order.sort_events_by_start_date(list(countries_and_events.values()))
        response = data_pb2.CountryEventsResponse()
        response.country_events.extend(sorted_countries_and_events)
        return MessageToDict(response)
