import {NextFunction, Request, Response} from "express";
import {APIResponse} from "../models/APIResponse";
import {transformResponse} from "../services/transformResponse";
import {APIError} from "../models/errors/APIError";
import {HandlerError} from "../types";

function payloadFromError(err:HandlerError) {
  if(Array.isArray(err)) {
    return err.map(error => payloadFromError(error));
  }

  if(err instanceof Error) {
    return err.message;
  }

  return Object.entries(err).reduce((result, [key, error]) => {
    result[key] = payloadFromError(error);
    return result;
  }, {});
}

export function ErrorMiddleware(err:any, request:Request, response:Response, next:NextFunction) {
  if(err instanceof Error) {
    //Change to an unexpected error to be handled immediately
    err = new APIError({ payload:err });
  }

  if(err instanceof APIResponse) {
    transformResponse(response, err);

    if(err instanceof APIError) {
      const payload = payloadFromError(err.payload);
      response.send(payload);
    } else {
      response.send(err.payload);
    }
  }

  return next(err);
}