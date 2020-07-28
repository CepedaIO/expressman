import {RouteHandlerConstructor} from "../types";
import {NextFunction, Request, Response} from "express";
import Manifest, {Middleware} from "../services/Manifest";
import {payloadFromMap} from "../services/payloadFromMap";
import {ValidationError} from "../models/errors/ValidationError";

async function getPayload(constructor:RouteHandlerConstructor, req:Request) {
  const inputMap = Manifest.getInputMap(constructor);
  if(!inputMap) {
    return { payload:req.body, errors:[] };
  }

  const {payload, errorPairs, valid} = await payloadFromMap(req, inputMap);
  const InputClass = Manifest.getInputClass(constructor)!;
  const error = new ValidationError({
    payload: errorPairs
  });

  return {
    payload: Object.assign(new InputClass(), payload),
    error,
    valid
  };
}

export function HandlerMiddleware(constructor:RouteHandlerConstructor, onResult?: (result:any, resp:Response) => void): Middleware {
  return async (req:Request, resp:Response, next:NextFunction) => {
    const container = resp.locals.container;
    const handler = container.resolve(constructor);

    try {
      const { payload, error, valid } = await getPayload(constructor, req);
      resp.locals['$payload'] = payload;
      resp.locals['$validationError'] = error;
      resp.locals['$valid'] = valid;

      if(!valid) {
        return next(error);
      }

      const result = await handler.handle(payload);
      resp.locals[constructor.name] = result;
      onResult && onResult(result, resp);
      return next();
    } catch(err) {
      if(handler.catch) {
        try {
          const result = await handler.catch(err);
          resp.locals[constructor.name] = result;
          onResult && onResult(result, resp);
          return next();
        } catch(newErr) {
          return next(newErr);
        }
      } else {
        return next(err);
      }
    }
  }
}