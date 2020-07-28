import {Pairs, Require} from "../types";

export class APIResponse<PayloadType = JSON> {
  statusCode: number = 200;
  payload:PayloadType;
  contentType:string = 'application/json';
  headers: Pairs = {};
  cookies: Pairs = {};

  constructor(data:Require<Partial<APIResponse<PayloadType>>, 'payload'>) {
    Object.assign(this, data);
  }
}