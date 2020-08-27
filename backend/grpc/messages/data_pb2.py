# -*- coding: utf-8 -*-
# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: data.proto

from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database
# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()


from google.protobuf import timestamp_pb2 as google_dot_protobuf_dot_timestamp__pb2


DESCRIPTOR = _descriptor.FileDescriptor(
  name='data.proto',
  package='datapb',
  syntax='proto3',
  serialized_options=None,
  create_key=_descriptor._internal_create_key,
  serialized_pb=b'\n\ndata.proto\x12\x06\x64\x61tapb\x1a\x1fgoogle/protobuf/timestamp.proto\"0\n\x1cSegmentedTimelineDataRequest\x12\x10\n\x08\x66ilename\x18\x01 \x01(\t\"t\n\x0bSegmentData\x12\x0f\n\x07\x63ountry\x18\x01 \x01(\t\x12\x0e\n\x06\x64\x65vice\x18\x02 \x01(\t\x12)\n\x05\x64\x61tes\x18\x03 \x03(\x0b\x32\x1a.google.protobuf.Timestamp\x12\x19\n\x11inventory_volumes\x18\x04 \x03(\x05\"f\n\x1dSegmentedTimelineDataResponse\x12!\n\x04\x64\x61ta\x18\x01 \x03(\x0b\x32\x13.datapb.SegmentData\x12\x11\n\tcountries\x18\x02 \x03(\t\x12\x0f\n\x07\x64\x65vices\x18\x03 \x03(\t\"\xa0\x01\n SegmentedTimelineCompareResponse\x12<\n\roriginal_data\x18\x01 \x01(\x0b\x32%.datapb.SegmentedTimelineDataResponse\x12>\n\x0f\x63omparison_data\x18\x02 \x01(\x0b\x32%.datapb.SegmentedTimelineDataResponse\"\xc9\x01\n\x12SegmentedDataError\x12\x0f\n\x07\x63ountry\x18\x01 \x01(\t\x12\x0e\n\x06\x64\x65vice\x18\x02 \x01(\t\x12)\n\x05\x64\x61tes\x18\x03 \x03(\x0b\x32\x1a.google.protobuf.Timestamp\x12\r\n\x05\x65rror\x18\x04 \x03(\x02\x12\x0b\n\x03min\x18\x05 \x01(\x02\x12\x0b\n\x03max\x18\x06 \x01(\x02\x12\x0e\n\x06median\x18\x07 \x01(\x02\x12\x16\n\x0e\x66irst_quartile\x18\x08 \x01(\x02\x12\x16\n\x0ethird_quartile\x18\t \x01(\x02\"H\n\x1aSegmentedDataErrorResponse\x12*\n\x06\x65rrors\x18\x01 \x03(\x0b\x32\x1a.datapb.SegmentedDataError2o\n\x04\x44\x61ta\x12g\n\x18getSegmentedTimelineData\x12$.datapb.SegmentedTimelineDataRequest\x1a%.datapb.SegmentedTimelineDataResponseb\x06proto3'
  ,
  dependencies=[google_dot_protobuf_dot_timestamp__pb2.DESCRIPTOR,])




_SEGMENTEDTIMELINEDATAREQUEST = _descriptor.Descriptor(
  name='SegmentedTimelineDataRequest',
  full_name='datapb.SegmentedTimelineDataRequest',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='filename', full_name='datapb.SegmentedTimelineDataRequest.filename', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=55,
  serialized_end=103,
)


_SEGMENTDATA = _descriptor.Descriptor(
  name='SegmentData',
  full_name='datapb.SegmentData',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='country', full_name='datapb.SegmentData.country', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='device', full_name='datapb.SegmentData.device', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='dates', full_name='datapb.SegmentData.dates', index=2,
      number=3, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='inventory_volumes', full_name='datapb.SegmentData.inventory_volumes', index=3,
      number=4, type=5, cpp_type=1, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=105,
  serialized_end=221,
)


_SEGMENTEDTIMELINEDATARESPONSE = _descriptor.Descriptor(
  name='SegmentedTimelineDataResponse',
  full_name='datapb.SegmentedTimelineDataResponse',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='data', full_name='datapb.SegmentedTimelineDataResponse.data', index=0,
      number=1, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='countries', full_name='datapb.SegmentedTimelineDataResponse.countries', index=1,
      number=2, type=9, cpp_type=9, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='devices', full_name='datapb.SegmentedTimelineDataResponse.devices', index=2,
      number=3, type=9, cpp_type=9, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=223,
  serialized_end=325,
)


_SEGMENTEDTIMELINECOMPARERESPONSE = _descriptor.Descriptor(
  name='SegmentedTimelineCompareResponse',
  full_name='datapb.SegmentedTimelineCompareResponse',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='original_data', full_name='datapb.SegmentedTimelineCompareResponse.original_data', index=0,
      number=1, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='comparison_data', full_name='datapb.SegmentedTimelineCompareResponse.comparison_data', index=1,
      number=2, type=11, cpp_type=10, label=1,
      has_default_value=False, default_value=None,
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=328,
  serialized_end=488,
)


_SEGMENTEDDATAERROR = _descriptor.Descriptor(
  name='SegmentedDataError',
  full_name='datapb.SegmentedDataError',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='country', full_name='datapb.SegmentedDataError.country', index=0,
      number=1, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='device', full_name='datapb.SegmentedDataError.device', index=1,
      number=2, type=9, cpp_type=9, label=1,
      has_default_value=False, default_value=b"".decode('utf-8'),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='dates', full_name='datapb.SegmentedDataError.dates', index=2,
      number=3, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='error', full_name='datapb.SegmentedDataError.error', index=3,
      number=4, type=2, cpp_type=6, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='min', full_name='datapb.SegmentedDataError.min', index=4,
      number=5, type=2, cpp_type=6, label=1,
      has_default_value=False, default_value=float(0),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='max', full_name='datapb.SegmentedDataError.max', index=5,
      number=6, type=2, cpp_type=6, label=1,
      has_default_value=False, default_value=float(0),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='median', full_name='datapb.SegmentedDataError.median', index=6,
      number=7, type=2, cpp_type=6, label=1,
      has_default_value=False, default_value=float(0),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='first_quartile', full_name='datapb.SegmentedDataError.first_quartile', index=7,
      number=8, type=2, cpp_type=6, label=1,
      has_default_value=False, default_value=float(0),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
    _descriptor.FieldDescriptor(
      name='third_quartile', full_name='datapb.SegmentedDataError.third_quartile', index=8,
      number=9, type=2, cpp_type=6, label=1,
      has_default_value=False, default_value=float(0),
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=491,
  serialized_end=692,
)


_SEGMENTEDDATAERRORRESPONSE = _descriptor.Descriptor(
  name='SegmentedDataErrorResponse',
  full_name='datapb.SegmentedDataErrorResponse',
  filename=None,
  file=DESCRIPTOR,
  containing_type=None,
  create_key=_descriptor._internal_create_key,
  fields=[
    _descriptor.FieldDescriptor(
      name='errors', full_name='datapb.SegmentedDataErrorResponse.errors', index=0,
      number=1, type=11, cpp_type=10, label=3,
      has_default_value=False, default_value=[],
      message_type=None, enum_type=None, containing_type=None,
      is_extension=False, extension_scope=None,
      serialized_options=None, file=DESCRIPTOR,  create_key=_descriptor._internal_create_key),
  ],
  extensions=[
  ],
  nested_types=[],
  enum_types=[
  ],
  serialized_options=None,
  is_extendable=False,
  syntax='proto3',
  extension_ranges=[],
  oneofs=[
  ],
  serialized_start=694,
  serialized_end=766,
)

_SEGMENTDATA.fields_by_name['dates'].message_type = google_dot_protobuf_dot_timestamp__pb2._TIMESTAMP
_SEGMENTEDTIMELINEDATARESPONSE.fields_by_name['data'].message_type = _SEGMENTDATA
_SEGMENTEDTIMELINECOMPARERESPONSE.fields_by_name['original_data'].message_type = _SEGMENTEDTIMELINEDATARESPONSE
_SEGMENTEDTIMELINECOMPARERESPONSE.fields_by_name['comparison_data'].message_type = _SEGMENTEDTIMELINEDATARESPONSE
_SEGMENTEDDATAERROR.fields_by_name['dates'].message_type = google_dot_protobuf_dot_timestamp__pb2._TIMESTAMP
_SEGMENTEDDATAERRORRESPONSE.fields_by_name['errors'].message_type = _SEGMENTEDDATAERROR
DESCRIPTOR.message_types_by_name['SegmentedTimelineDataRequest'] = _SEGMENTEDTIMELINEDATAREQUEST
DESCRIPTOR.message_types_by_name['SegmentData'] = _SEGMENTDATA
DESCRIPTOR.message_types_by_name['SegmentedTimelineDataResponse'] = _SEGMENTEDTIMELINEDATARESPONSE
DESCRIPTOR.message_types_by_name['SegmentedTimelineCompareResponse'] = _SEGMENTEDTIMELINECOMPARERESPONSE
DESCRIPTOR.message_types_by_name['SegmentedDataError'] = _SEGMENTEDDATAERROR
DESCRIPTOR.message_types_by_name['SegmentedDataErrorResponse'] = _SEGMENTEDDATAERRORRESPONSE
_sym_db.RegisterFileDescriptor(DESCRIPTOR)

SegmentedTimelineDataRequest = _reflection.GeneratedProtocolMessageType('SegmentedTimelineDataRequest', (_message.Message,), {
  'DESCRIPTOR' : _SEGMENTEDTIMELINEDATAREQUEST,
  '__module__' : 'data_pb2'
  # @@protoc_insertion_point(class_scope:datapb.SegmentedTimelineDataRequest)
  })
_sym_db.RegisterMessage(SegmentedTimelineDataRequest)

SegmentData = _reflection.GeneratedProtocolMessageType('SegmentData', (_message.Message,), {
  'DESCRIPTOR' : _SEGMENTDATA,
  '__module__' : 'data_pb2'
  # @@protoc_insertion_point(class_scope:datapb.SegmentData)
  })
_sym_db.RegisterMessage(SegmentData)

SegmentedTimelineDataResponse = _reflection.GeneratedProtocolMessageType('SegmentedTimelineDataResponse', (_message.Message,), {
  'DESCRIPTOR' : _SEGMENTEDTIMELINEDATARESPONSE,
  '__module__' : 'data_pb2'
  # @@protoc_insertion_point(class_scope:datapb.SegmentedTimelineDataResponse)
  })
_sym_db.RegisterMessage(SegmentedTimelineDataResponse)

SegmentedTimelineCompareResponse = _reflection.GeneratedProtocolMessageType('SegmentedTimelineCompareResponse', (_message.Message,), {
  'DESCRIPTOR' : _SEGMENTEDTIMELINECOMPARERESPONSE,
  '__module__' : 'data_pb2'
  # @@protoc_insertion_point(class_scope:datapb.SegmentedTimelineCompareResponse)
  })
_sym_db.RegisterMessage(SegmentedTimelineCompareResponse)

SegmentedDataError = _reflection.GeneratedProtocolMessageType('SegmentedDataError', (_message.Message,), {
  'DESCRIPTOR' : _SEGMENTEDDATAERROR,
  '__module__' : 'data_pb2'
  # @@protoc_insertion_point(class_scope:datapb.SegmentedDataError)
  })
_sym_db.RegisterMessage(SegmentedDataError)

SegmentedDataErrorResponse = _reflection.GeneratedProtocolMessageType('SegmentedDataErrorResponse', (_message.Message,), {
  'DESCRIPTOR' : _SEGMENTEDDATAERRORRESPONSE,
  '__module__' : 'data_pb2'
  # @@protoc_insertion_point(class_scope:datapb.SegmentedDataErrorResponse)
  })
_sym_db.RegisterMessage(SegmentedDataErrorResponse)



_DATA = _descriptor.ServiceDescriptor(
  name='Data',
  full_name='datapb.Data',
  file=DESCRIPTOR,
  index=0,
  serialized_options=None,
  create_key=_descriptor._internal_create_key,
  serialized_start=768,
  serialized_end=879,
  methods=[
  _descriptor.MethodDescriptor(
    name='getSegmentedTimelineData',
    full_name='datapb.Data.getSegmentedTimelineData',
    index=0,
    containing_service=None,
    input_type=_SEGMENTEDTIMELINEDATAREQUEST,
    output_type=_SEGMENTEDTIMELINEDATARESPONSE,
    serialized_options=None,
    create_key=_descriptor._internal_create_key,
  ),
])
_sym_db.RegisterServiceDescriptor(_DATA)

DESCRIPTOR.services_by_name['Data'] = _DATA

# @@protoc_insertion_point(module_scope)
