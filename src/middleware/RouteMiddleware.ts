import {Wrapperware} from "../types";
import {NextFunction, Request, RequestHandler, Response} from "express";
import {RouteDescriptor} from "../services/RouteMetadata";
import {payloadFromMap} from "../services/payloadFromMap";
import {ValidationError} from "../models/errors/ValidationError";
import DependencyContainer from "tsyringe/dist/typings/types/dependency-container";
import InputMetadata from "../services/InputMetadata";

async function getPayload(descriptor:RouteDescriptor, req:Request) {
  const inputMetadata = InputMetadata.get(descriptor.target);
  
  if(!inputMetadata) {
    return { payload:req.body, errors:[], valid: true };
  }
  
  const {payload, errorPairs, valid} = await payloadFromMap(inputMetadata, req);
  const InputClass = inputMetadata.target;
  
  const error = new ValidationError();
  error.payload = errorPairs;

  return {
    payload: Object.assign(new InputClass(), payload),
    error,
    valid
  };
}

export function RouteMiddleware(descriptor: RouteDescriptor, onResult?: (result:any, resp:Response) => void): RequestHandler {
  let handler;

  return async (req:Request, resp:Response, next:NextFunction) => {
    try {
      const container = resp.locals.container as DependencyContainer;
      const { payload, error, valid } = await getPayload(descriptor, req);
      resp.locals['$payload'] = payload;
      resp.locals['$validationError'] = error;
      resp.locals['$valid'] = valid;

      if(!valid) {
        return next(error);
      }

      const action = async () => {
        handler = container.resolve(descriptor.target);
        const result = await handler[descriptor.property](payload);
        resp.locals[descriptor.target.name] = result;
        onResult && onResult(result, resp);
        return next();
      }

      if(descriptor.wrap) {
        const wrappedAction = wrap(container, action, descriptor.wrap);
        return wrappedAction();
      } else {
        return action();
      }
    } catch(err) {
      if(handler.catch) {
        try {
          const result = await handler.catch(err);
          resp.locals[descriptor.target.name] = result;
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
