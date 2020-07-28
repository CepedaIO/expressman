import {Response} from "express";
import {APIResponse} from "../models/APIResponse";

export function transformResponse<T>(response:Response, apiResponse:APIResponse<T>) {
  response.status(apiResponse.statusCode);

  if(apiResponse.headers['Content-Type']) {
    response.contentType(apiResponse.headers['Content-Type'] as string);
  } else {
    response.contentType(apiResponse.contentType);
  }

  Object.entries(apiResponse.headers).forEach(([header, value]) => response.setHeader(header, value));
  Object.entries(apiResponse.cookies).forEach(([cookie, value]) => response.cookie(cookie, value));

}