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
}

export interface SegmentedDataErrorResponse {
  errors: SegmentedDataError[];
}

const baseSegmentedTimelineDataRequest: object = {
  filename: "",
};

const baseSegmentData: object = {
  country: "",
  device: "",
  inventoryVolumes: 0,
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
};

const baseSegmentedDataErrorResponse: object = {
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