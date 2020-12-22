import {RouteHandlerConstructor, Wrapperware} from "../types";
import {NextFunction, Request, RequestHandler, Response} from "express";
import Manifest from "../services/Manifest";
import {payloadFromMap} from "../services/payloadFromMap";
import {ValidationError} from "../models/errors/ValidationError";
import DependencyContainer from "tsyringe/dist/typings/types/dependency-container";

async function getPayload(constructor:RouteHandlerConstructor, req:Request) {
  const inputMap = Manifest.getInputMap(constructor);
  if(!inputMap) {
    return { payload:req.body, errors:[], valid: true };
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

export function HandlerMiddleware(constructor:RouteHandlerConstructor, wrappers?: Array<Wrapperware>, onResult?: (result:any, resp:Response) => void): RequestHandler {
  let handler;

  return async (req:Request, resp:Response, next:NextFunction) => {
    try {
      const container = resp.locals.container;
      const { payload, error, valid } = await getPayload(constructor, req);
      resp.locals['$payload'] = payload;
      resp.locals['$validationError'] = error;
      resp.locals['$valid'] = valid;

      if(!valid) {
        return next(error);
      }

      const action = async () => {
        handler = container.resolve(constructor);
        const result = await handler.handle(payload);
        resp.locals[constructor.name] = result;
        onResult && onResult(result, resp);
        return next();
      }

      if(wrappers) {
        const wrappedAction = wrap(container, action, wrappers);
        return wrappedAction();
      } else {
        return action();
      }
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

function wrap(container: DependencyContainer, initiator: () => Promise<any>, wrappers: Array<Wrapperware>): () => Promise<any> {
  return wrappers.reduce((previousCaller, wrapper) => {
    return async () => {
      await wrapper(container, previousCaller as () => Promise<any>);
    };
  }, initiator) as () => Promise<any>;
}
