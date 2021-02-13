import {NextFunction, Request, Response} from "express";
import {transformResponse} from "../services/transformResponse";
import {APIError} from "../models/errors/APIError";
import {HandlerError} from "../types";
import DependencyContainer from "tsyringe/dist/typings/types/dependency-container";

function payloadFromError(err:HandlerError) {
  if(Array.isArray(err)) {
    return {
      errors: err.map(error => payloadFromError(error))
    };
  }

  if(err instanceof Error) {
    return {
      message: err.message,
      stack: err.stack?.split('\n')
    };
  }

  if(typeof err === 'object') {
    const fields = Object.entries(err).reduce((result, [key, error]) => {
      result[key] = payloadFromError(error);
      return result;
    }, {});

    return {
      fields
    };
  }

  return err;
}

function sendAPIError(response:Response, err:any) {
  let apiError;
  
  if(err instanceof  APIError) {
    apiError = err;
  } else {
    apiError = new APIError();
    apiError.payload = err;
  }
  
  transformResponse(response, apiError);
  let payload = payloadFromError(apiError.payload);
  response.send(payload);
}

export function ErrorMiddleware(onUncaughtException?:(container: DependencyContainer, error:APIError) => Promise<any>) {
  return async (err:any, request:Request, response:Response, next:NextFunction) => {
    let overrideError;
    debugger;

    if(onUncaughtException) {
      const container = response.locals.container;
      overrideError = await onUncaughtException(container, err);
    }

    if(!overrideError) {
      sendAPIError(response, overrideError);
    } else {
      sendAPIError(response, err);
    }

    next(err);
  };
}
