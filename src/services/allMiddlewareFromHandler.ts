import {NextFunction, Request, Response} from "express";
import Manifest, {Middleware} from "./Manifest";
import { flatten } from 'lodash';
import {RouteHandlerConstructor} from "../types";
import {payloadFromMap} from "./payloadFromMap"

async function getPayload(constructor:RouteHandlerConstructor, req:Request) {
  const inputMap = Manifest.getInputMap(constructor);
  if(!inputMap) {
    return { payload:req.body, errors:[] };
  }

  const result = await payloadFromMap(req, inputMap);
  const InputClass = Manifest.getInputClass(constructor)!;
  return {
    payload: Object.assign(new InputClass(), result.payload),
    errors: result.errors
  };
}


function middlewareFromHandler(constructor:RouteHandlerConstructor, onResult?: (result:any, resp:Response) => void): Middleware {
  return async (req:Request, resp:Response, next:NextFunction) => {
    const container = resp.locals.container;
    const handler = container.resolve(constructor);

    try {
      const { payload, errors } = await getPayload(constructor, req);
      resp.locals['$payload'] = payload;
      resp.locals['$validationErrors'] = errors;

      if(errors.length > 0) {
        next(errors);
      }

      const result = await handler.handle(payload);
      resp.locals[constructor.name] = result;
      onResult && onResult(result, resp);
      next();
    } catch(err) {
      if(handler.catch) {
        try {
          const result = await handler.catch(err);
          resp.locals[constructor.name] = result;
          onResult && onResult(result, resp);
          next();
        } catch(newErr) {
          next(newErr);
        }
      } else {
        next(err);
      }
    }
  }
}

export function allMiddlewareFromHandler(constructor:RouteHandlerConstructor): Middleware[] {
  const middleware:Middleware[] = [];

  if(Manifest.before.has(constructor)) {
    const beforeRouteHandlers = Manifest.before.get(constructor)!;
    const beforeMiddleware = beforeRouteHandlers.map(handler => allMiddlewareFromHandler(handler));
    middleware.push(...flatten(beforeMiddleware));
  }

  middleware.push(middlewareFromHandler(constructor, (result, resp:Response) => {
    resp.locals['$response'] = result;
  }));

  if(Manifest.after.has(constructor)) {
    const afterRouteHandlers = Manifest.after.get(constructor)!;
    const afterMiddleware = afterRouteHandlers.map(handler => allMiddlewareFromHandler(handler));
    middleware.push(...flatten(afterMiddleware));
  }

  return middleware;
}
