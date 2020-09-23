/* eslint-disable */
import { Reader, Writer } from 'protobufjs/minimal';
import { Timestamp } from '../google/protobuf/timestamp';


export interface SegmentedTimelineDataRequest {
  filename: string;
}

/**
 *  Segment defines a Tukey curve for a particular country and device.
 */
export interface SegmentData {
  country: string;
  device: string;
  /**
   *  For every date in the date array there is a corresponding inventory
   *  volume in the inventory_volumes array
   */
  dates: Date[];
  inventoryVolumes: number[];
  segmentSignificance: number;
}

export interface SegmentedTimelineDataResponse {
  data: SegmentData[];
  countries: string[];
  devices: string[];
}

export interface SegmentedTimelineCompareResponse {
  originalData: SegmentedTimelineDataResponse | undefined;
  comparisonData: SegmentedTimelineDataResponse | undefined;
}

export interface SegmentedDataError {
  country: string;
  device: string;
  dates: Date[];
  error: number[];
  min: number;
  max: number;
  median: number;
  firstQuartile: number;
  thirdQuartile: number;
  weightedErrorAverage: number;
  segmentSignificance: number;
}

export interface SegmentedDataErrorResponse {
  errors: SegmentedDataError[];
}

export interface Event {
  name: string;
  start: Date | undefined;
  end: Date | undefined;
}

export interface CountryEvents {
  country: string;
  events: Event[];
}

export interface CountryEventsResponse {
  countryEvents: CountryEvents[];
}

const baseSegmentedTimelineDataRequest: object = {
  filename: "",
};

const baseSegmentData: object = {
  country: "",
  device: "",
  inventoryVolumes: 0,
  segmentSignificance: 0,
};

const baseSegmentedTimelineDataResponse: object = {
  countries: "",
  devices: "",
};

const baseSegmentedTimelineCompareResponse: object = {
};

const baseSegmentedDataError: object = {
  country: "",
  device: "",
  error: 0,
  min: 0,
  max: 0,
  median: 0,
  firstQuartile: 0,
  thirdQuartile: 0,
  weightedErrorAverage: 0,
  segmentSignificance: 0,
};

const baseSegmentedDataErrorResponse: object = {
};

const baseEvent: object = {
  name: "",
};

const baseCountryEvents: object = {
  country: "",
};

const baseCountryEventsResponse: object = {
};

export interface Data {

  getSegmentedTimelineData(request: SegmentedTimelineDataRequest): Promise<SegmentedTimelineDataResponse>;

}

export class DataClientImpl implements Data {

  private readonly rpc: Rpc;

  constructor(rpc: Rpc) {
    this.rpc = rpc;
  }

  getSegmentedTimelineData(request: SegmentedTimelineDataRequest): Promise<SegmentedTimelineDataResponse> {
    const data = SegmentedTimelineDataRequest.encode(request).finish();
    const promise = this.rpc.request("datapb.Data", "getSegmentedTimelineData", data);
    return promise.then(data => SegmentedTimelineDataResponse.decode(new Reader(data)));
  }

}

interface Rpc {

  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;

}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

export const SegmentedTimelineDataRequest = {
  encode(message: SegmentedTimelineDataRequest, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.filename);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): SegmentedTimelineDataRequest {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSegmentedTimelineDataRequest } as SegmentedTimelineDataRequest;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.filename = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): SegmentedTimelineDataRequest {
    const message = { ...baseSegmentedTimelineDataRequest } as SegmentedTimelineDataRequest;
    if (object.filename !== undefined && object.filename !== null) {
      message.filename = String(object.filename);
    } else {
      message.filename = "";
    }
    return message;
  },
  fromPartial(object: DeepPartial<SegmentedTimelineDataRequest>): SegmentedTimelineDataRequest {
    const message = { ...baseSegmentedTimelineDataRequest } as SegmentedTimelineDataRequest;
    if (object.filename !== undefined && object.filename !== null) {
      message.filename = object.filename;
    } else {
      message.filename = "";
    }
    return message;
  },
  toJSON(message: SegmentedTimelineDataRequest): unknown {
    const obj: any = {};
    obj.filename = message.filename || "";
    return obj;
  },
};

export const SegmentData = {
  encode(message: SegmentData, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.country);
    writer.uint32(18).string(message.device);
    for (const v of message.dates) {
      Timestamp.encode(toTimestamp(v!), writer.uint32(26).fork()).ldelim();
    }
    writer.uint32(34).fork();
    for (const v of message.inventoryVolumes) {
      writer.int32(v);
    }
    writer.ldelim();
    writer.uint32(40).int32(message.segmentSignificance);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): SegmentData {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSegmentData } as SegmentData;
    message.dates = [];
    message.inventoryVolumes = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.country = reader.string();
          break;
        case 2:
          message.device = reader.string();
          break;
        case 3:
          message.dates.push(fromTimestamp(Timestamp.decode(reader, reader.uint32())));
          break;
        case 4:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.inventoryVolumes.push(reader.int32());
            }
          } else {
            message.inventoryVolumes.push(reader.int32());
          }
          break;
        case 5:
          message.segmentSignificance = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): SegmentData {
    const message = { ...baseSegmentData } as SegmentData;
    message.dates = [];
    message.inventoryVolumes = [];
    if (object.country !== undefined && object.country !== null) {
      message.country = String(object.country);
    } else {
      message.country = "";
    }
    if (object.device !== undefined && object.device !== null) {
      message.device = String(object.device);
    } else {
      message.device = "";
    }
    if (object.dates !== undefined && object.dates !== null) {
      for (const e of object.dates) {
        message.dates.push(fromJsonTimestamp(e));
      }
    }
    if (object.inventoryVolumes !== undefined && object.inventoryVolumes !== null) {
      for (const e of object.inventoryVolumes) {
        message.inventoryVolumes.push(Number(e));
      }
    }
    if (object.segmentSignificance !== undefined && object.segmentSignificance !== null) {
      message.segmentSignificance = Number(object.segmentSignificance);
    } else {
      message.segmentSignificance = 0;
    }
    return message;
  },
  fromPartial(object: DeepPartial<SegmentData>): SegmentData {
    const message = { ...baseSegmentData } as SegmentData;
    message.dates = [];
    message.inventoryVolumes = [];
    if (object.country !== undefined && object.country !== null) {
      message.country = object.country;
    } else {
      message.country = "";
    }
    if (object.device !== undefined && object.device !== null) {
      message.device = object.device;
    } else {
      message.device = "";
    }
    if (object.dates !== undefined && object.dates !== null) {
      for (const e of object.dates) {
        message.dates.push(e);
      }
    }
    if (object.inventoryVolumes !== undefined && object.inventoryVolumes !== null) {
      for (const e of object.inventoryVolumes) {
        message.inventoryVolumes.push(e);
      }
    }
    if (object.segmentSignificance !== undefined && object.segmentSignificance !== null) {
      message.segmentSignificance = object.segmentSignificance;
    } else {
      message.segmentSignificance = 0;
    }
    return message;
  },
  toJSON(message: SegmentData): unknown {
    const obj: any = {};
    obj.country = message.country || "";
    obj.device = message.device || "";
    if (message.dates) {
      obj.dates = message.dates.map(e => e !== undefined ? e.toISOString() : null);
    } else {
      obj.dates = [];
    }
    if (message.inventoryVolumes) {
      obj.inventoryVolumes = message.inventoryVolumes.map(e => e || 0);
    } else {
      obj.inventoryVolumes = [];
    }
    obj.segmentSignificance = message.segmentSignificance || 0;
    return obj;
  },
};

export const SegmentedTimelineDataResponse = {
  encode(message: SegmentedTimelineDataResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.data) {
      SegmentData.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.countries) {
      writer.uint32(18).string(v!);
    }
    for (const v of message.devices) {
      writer.uint32(26).string(v!);
    }
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): SegmentedTimelineDataResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSegmentedTimelineDataResponse } as SegmentedTimelineDataResponse;
    message.data = [];
    message.countries = [];
    message.devices = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.data.push(SegmentData.decode(reader, reader.uint32()));
          break;
        case 2:
          message.countries.push(reader.string());
          break;
        case 3:
          message.devices.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): SegmentedTimelineDataResponse {
    const message = { ...baseSegmentedTimelineDataResponse } as SegmentedTimelineDataResponse;
    message.data = [];
    message.countries = [];
    message.devices = [];
    if (object.data !== undefined && object.data !== null) {
      for (const e of object.data) {
        message.data.push(SegmentData.fromJSON(e));
      }
    }
    if (object.countries !== undefined && object.countries !== null) {
      for (const e of object.countries) {
        message.countries.push(String(e));
      }
    }
    if (object.devices !== undefined && object.devices !== null) {
      for (const e of object.devices) {
        message.devices.push(String(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<SegmentedTimelineDataResponse>): SegmentedTimelineDataResponse {
    const message = { ...baseSegmentedTimelineDataResponse } as SegmentedTimelineDataResponse;
    message.data = [];
    message.countries = [];
    message.devices = [];
    if (object.data !== undefined && object.data !== null) {
      for (const e of object.data) {
        message.data.push(SegmentData.fromPartial(e));
      }
    }
    if (object.countries !== undefined && object.countries !== null) {
      for (const e of object.countries) {
        message.countries.push(e);
      }
    }
    if (object.devices !== undefined && object.devices !== null) {
      for (const e of object.devices) {
        message.devices.push(e);
      }
    }
    return message;
  },
  toJSON(message: SegmentedTimelineDataResponse): unknown {
    const obj: any = {};
    if (message.data) {
      obj.data = message.data.map(e => e ? SegmentData.toJSON(e) : undefined);
    } else {
      obj.data = [];
    }
    if (message.countries) {
      obj.countries = message.countries.map(e => e || "");
    } else {
      obj.countries = [];
    }
    if (message.devices) {
      obj.devices = message.devices.map(e => e || "");
    } else {
      obj.devices = [];
    }
    return obj;
  },
};

export const SegmentedTimelineCompareResponse = {
  encode(message: SegmentedTimelineCompareResponse, writer: Writer = Writer.create()): Writer {
    if (message.originalData !== undefined && message.originalData !== undefined) {
      SegmentedTimelineDataResponse.encode(message.originalData, writer.uint32(10).fork()).ldelim();
    }
    if (message.comparisonData !== undefined && message.comparisonData !== undefined) {
      SegmentedTimelineDataResponse.encode(message.comparisonData, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): SegmentedTimelineCompareResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSegmentedTimelineCompareResponse } as SegmentedTimelineCompareResponse;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.originalData = SegmentedTimelineDataResponse.decode(reader, reader.uint32());
          break;
        case 2:
          message.comparisonData = SegmentedTimelineDataResponse.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): SegmentedTimelineCompareResponse {
    const message = { ...baseSegmentedTimelineCompareResponse } as SegmentedTimelineCompareResponse;
    if (object.originalData !== undefined && object.originalData !== null) {
      message.originalData = SegmentedTimelineDataResponse.fromJSON(object.originalData);
    } else {
      message.originalData = undefined;
    }
    if (object.comparisonData !== undefined && object.comparisonData !== null) {
      message.comparisonData = SegmentedTimelineDataResponse.fromJSON(object.comparisonData);
    } else {
      message.comparisonData = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<SegmentedTimelineCompareResponse>): SegmentedTimelineCompareResponse {
    const message = { ...baseSegmentedTimelineCompareResponse } as SegmentedTimelineCompareResponse;
    if (object.originalData !== undefined && object.originalData !== null) {
      message.originalData = SegmentedTimelineDataResponse.fromPartial(object.originalData);
    } else {
      message.originalData = undefined;
    }
    if (object.comparisonData !== undefined && object.comparisonData !== null) {
      message.comparisonData = SegmentedTimelineDataResponse.fromPartial(object.comparisonData);
    } else {
      message.comparisonData = undefined;
    }
    return message;
  },
  toJSON(message: SegmentedTimelineCompareResponse): unknown {
    const obj: any = {};
    obj.originalData = message.originalData ? SegmentedTimelineDataResponse.toJSON(message.originalData) : undefined;
    obj.comparisonData = message.comparisonData ? SegmentedTimelineDataResponse.toJSON(message.comparisonData) : undefined;
    return obj;
  },
};

export const SegmentedDataError = {
  encode(message: SegmentedDataError, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.country);
    writer.uint32(18).string(message.device);
    for (const v of message.dates) {
      Timestamp.encode(toTimestamp(v!), writer.uint32(26).fork()).ldelim();
    }
    writer.uint32(34).fork();
    for (const v of message.error) {
      writer.float(v);
    }
    writer.ldelim();
    writer.uint32(45).float(message.min);
    writer.uint32(53).float(message.max);
    writer.uint32(61).float(message.median);
    writer.uint32(69).float(message.firstQuartile);
    writer.uint32(77).float(message.thirdQuartile);
    writer.uint32(85).float(message.weightedErrorAverage);
    writer.uint32(93).float(message.segmentSignificance);
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): SegmentedDataError {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSegmentedDataError } as SegmentedDataError;
    message.dates = [];
    message.error = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.country = reader.string();
          break;
        case 2:
          message.device = reader.string();
          break;
        case 3:
          message.dates.push(fromTimestamp(Timestamp.decode(reader, reader.uint32())));
          break;
        case 4:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.error.push(reader.float());
            }
          } else {
            message.error.push(reader.float());
          }
          break;
        case 5:
          message.min = reader.float();
          break;
        case 6:
          message.max = reader.float();
          break;
        case 7:
          message.median = reader.float();
          break;
        case 8:
          message.firstQuartile = reader.float();
          break;
        case 9:
          message.thirdQuartile = reader.float();
          break;
        case 10:
          message.weightedErrorAverage = reader.float();
          break;
        case 11:
          message.segmentSignificance = reader.float();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): SegmentedDataError {
    const message = { ...baseSegmentedDataError } as SegmentedDataError;
    message.dates = [];
    message.error = [];
    if (object.country !== undefined && object.country !== null) {
      message.country = String(object.country);
    } else {
      message.country = "";
    }
    if (object.device !== undefined && object.device !== null) {
      message.device = String(object.device);
    } else {
      message.device = "";
    }
    if (object.dates !== undefined && object.dates !== null) {
      for (const e of object.dates) {
        message.dates.push(fromJsonTimestamp(e));
      }
    }
    if (object.error !== undefined && object.error !== null) {
      for (const e of object.error) {
        message.error.push(Number(e));
      }
    }
    if (object.min !== undefined && object.min !== null) {
      message.min = Number(object.min);
    } else {
      message.min = 0;
    }
    if (object.max !== undefined && object.max !== null) {
      message.max = Number(object.max);
    } else {
      message.max = 0;
    }
    if (object.median !== undefined && object.median !== null) {
      message.median = Number(object.median);
    } else {
      message.median = 0;
    }
    if (object.firstQuartile !== undefined && object.firstQuartile !== null) {
      message.firstQuartile = Number(object.firstQuartile);
    } else {
      message.firstQuartile = 0;
    }
    if (object.thirdQuartile !== undefined && object.thirdQuartile !== null) {
      message.thirdQuartile = Number(object.thirdQuartile);
    } else {
      message.thirdQuartile = 0;
    }
    if (object.weightedErrorAverage !== undefined && object.weightedErrorAverage !== null) {
      message.weightedErrorAverage = Number(object.weightedErrorAverage);
    } else {
      message.weightedErrorAverage = 0;
    }
    if (object.segmentSignificance !== undefined && object.segmentSignificance !== null) {
      message.segmentSignificance = Number(object.segmentSignificance);
    } else {
      message.segmentSignificance = 0;
    }
    return message;
  },
  fromPartial(object: DeepPartial<SegmentedDataError>): SegmentedDataError {
    const message = { ...baseSegmentedDataError } as SegmentedDataError;
    message.dates = [];
    message.error = [];
    if (object.country !== undefined && object.country !== null) {
      message.country = object.country;
    } else {
      message.country = "";
    }
    if (object.device !== undefined && object.device !== null) {
      message.device = object.device;
    } else {
      message.device = "";
    }
    if (object.dates !== undefined && object.dates !== null) {
      for (const e of object.dates) {
        message.dates.push(e);
      }
    }
    if (object.error !== undefined && object.error !== null) {
      for (const e of object.error) {
        message.error.push(e);
      }
    }
    if (object.min !== undefined && object.min !== null) {
      message.min = object.min;
    } else {
      message.min = 0;
    }
    if (object.max !== undefined && object.max !== null) {
      message.max = object.max;
    } else {
      message.max = 0;
    }
    if (object.median !== undefined && object.median !== null) {
      message.median = object.median;
    } else {
      message.median = 0;
    }
    if (object.firstQuartile !== undefined && object.firstQuartile !== null) {
      message.firstQuartile = object.firstQuartile;
    } else {
      message.firstQuartile = 0;
    }
    if (object.thirdQuartile !== undefined && object.thirdQuartile !== null) {
      message.thirdQuartile = object.thirdQuartile;
    } else {
      message.thirdQuartile = 0;
    }
    if (object.weightedErrorAverage !== undefined && object.weightedErrorAverage !== null) {
      message.weightedErrorAverage = object.weightedErrorAverage;
    } else {
      message.weightedErrorAverage = 0;
    }
    if (object.segmentSignificance !== undefined && object.segmentSignificance !== null) {
      message.segmentSignificance = object.segmentSignificance;
    } else {
      message.segmentSignificance = 0;
    }
    return message;
  },
  toJSON(message: SegmentedDataError): unknown {
    const obj: any = {};
    obj.country = message.country || "";
    obj.device = message.device || "";
    if (message.dates) {
      obj.dates = message.dates.map(e => e !== undefined ? e.toISOString() : null);
    } else {
      obj.dates = [];
    }
    if (message.error) {
      obj.error = message.error.map(e => e || 0);
    } else {
      obj.error = [];
    }
    obj.min = message.min || 0;
    obj.max = message.max || 0;
    obj.median = message.median || 0;
    obj.firstQuartile = message.firstQuartile || 0;
    obj.thirdQuartile = message.thirdQuartile || 0;
    obj.weightedErrorAverage = message.weightedErrorAverage || 0;
    obj.segmentSignificance = message.segmentSignificance || 0;
    return obj;
  },
};

export const SegmentedDataErrorResponse = {
  encode(message: SegmentedDataErrorResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.errors) {
      SegmentedDataError.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): SegmentedDataErrorResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseSegmentedDataErrorResponse } as SegmentedDataErrorResponse;
    message.errors = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.errors.push(SegmentedDataError.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): SegmentedDataErrorResponse {
    const message = { ...baseSegmentedDataErrorResponse } as SegmentedDataErrorResponse;
    message.errors = [];
    if (object.errors !== undefined && object.errors !== null) {
      for (const e of object.errors) {
        message.errors.push(SegmentedDataError.fromJSON(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<SegmentedDataErrorResponse>): SegmentedDataErrorResponse {
    const message = { ...baseSegmentedDataErrorResponse } as SegmentedDataErrorResponse;
    message.errors = [];
    if (object.errors !== undefined && object.errors !== null) {
      for (const e of object.errors) {
        message.errors.push(SegmentedDataError.fromPartial(e));
      }
    }
    return message;
  },
  toJSON(message: SegmentedDataErrorResponse): unknown {
    const obj: any = {};
    if (message.errors) {
      obj.errors = message.errors.map(e => e ? SegmentedDataError.toJSON(e) : undefined);
    } else {
      obj.errors = [];
    }
    return obj;
  },
};

export const Event = {
  encode(message: Event, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.name);
    if (message.start !== undefined && message.start !== undefined) {
      Timestamp.encode(toTimestamp(message.start), writer.uint32(18).fork()).ldelim();
    }
    if (message.end !== undefined && message.end !== undefined) {
      Timestamp.encode(toTimestamp(message.end), writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): Event {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseEvent } as Event;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.name = reader.string();
          break;
        case 2:
          message.start = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        case 3:
          message.end = fromTimestamp(Timestamp.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): Event {
    const message = { ...baseEvent } as Event;
    if (object.name !== undefined && object.name !== null) {
      message.name = String(object.name);
    } else {
      message.name = "";
    }
    if (object.start !== undefined && object.start !== null) {
      message.start = fromJsonTimestamp(object.start);
    } else {
      message.start = undefined;
    }
    if (object.end !== undefined && object.end !== null) {
      message.end = fromJsonTimestamp(object.end);
    } else {
      message.end = undefined;
    }
    return message;
  },
  fromPartial(object: DeepPartial<Event>): Event {
    const message = { ...baseEvent } as Event;
    if (object.name !== undefined && object.name !== null) {
      message.name = object.name;
    } else {
      message.name = "";
    }
    if (object.start !== undefined && object.start !== null) {
      message.start = object.start;
    } else {
      message.start = undefined;
    }
    if (object.end !== undefined && object.end !== null) {
      message.end = object.end;
    } else {
      message.end = undefined;
    }
    return message;
  },
  toJSON(message: Event): unknown {
    const obj: any = {};
    obj.name = message.name || "";
    obj.start = message.start !== undefined ? message.start.toISOString() : null;
    obj.end = message.end !== undefined ? message.end.toISOString() : null;
    return obj;
  },
};

export const CountryEvents = {
  encode(message: CountryEvents, writer: Writer = Writer.create()): Writer {
    writer.uint32(10).string(message.country);
    for (const v of message.events) {
      Event.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): CountryEvents {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCountryEvents } as CountryEvents;
    message.events = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.country = reader.string();
          break;
        case 2:
          message.events.push(Event.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CountryEvents {
    const message = { ...baseCountryEvents } as CountryEvents;
    message.events = [];
    if (object.country !== undefined && object.country !== null) {
      message.country = String(object.country);
    } else {
      message.country = "";
    }
    if (object.events !== undefined && object.events !== null) {
      for (const e of object.events) {
        message.events.push(Event.fromJSON(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<CountryEvents>): CountryEvents {
    const message = { ...baseCountryEvents } as CountryEvents;
    message.events = [];
    if (object.country !== undefined && object.country !== null) {
      message.country = object.country;
    } else {
      message.country = "";
    }
    if (object.events !== undefined && object.events !== null) {
      for (const e of object.events) {
        message.events.push(Event.fromPartial(e));
      }
    }
    return message;
  },
  toJSON(message: CountryEvents): unknown {
    const obj: any = {};
    obj.country = message.country || "";
    if (message.events) {
      obj.events = message.events.map(e => e ? Event.toJSON(e) : undefined);
    } else {
      obj.events = [];
    }
    return obj;
  },
};

export const CountryEventsResponse = {
  encode(message: CountryEventsResponse, writer: Writer = Writer.create()): Writer {
    for (const v of message.countryEvents) {
      CountryEvents.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },
  decode(input: Uint8Array | Reader, length?: number): CountryEventsResponse {
    const reader = input instanceof Uint8Array ? new Reader(input) : input;
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = { ...baseCountryEventsResponse } as CountryEventsResponse;
    message.countryEvents = [];
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.countryEvents.push(CountryEvents.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },
  fromJSON(object: any): CountryEventsResponse {
    const message = { ...baseCountryEventsResponse } as CountryEventsResponse;
    message.countryEvents = [];
    if (object.countryEvents !== undefined && object.countryEvents !== null) {
      for (const e of object.countryEvents) {
        message.countryEvents.push(CountryEvents.fromJSON(e));
      }
    }
    return message;
  },
  fromPartial(object: DeepPartial<CountryEventsResponse>): CountryEventsResponse {
    const message = { ...baseCountryEventsResponse } as CountryEventsResponse;
    message.countryEvents = [];
    if (object.countryEvents !== undefined && object.countryEvents !== null) {
      for (const e of object.countryEvents) {
        message.countryEvents.push(CountryEvents.fromPartial(e));
      }
    }
    return message;
  },
  toJSON(message: CountryEventsResponse): unknown {
    const obj: any = {};
    if (message.countryEvents) {
      obj.countryEvents = message.countryEvents.map(e => e ? CountryEvents.toJSON(e) : undefined);
    } else {
      obj.countryEvents = [];
    }
    return obj;
  },
};

type Builtin = Date | Function | Uint8Array | string | number | undefined;
type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;