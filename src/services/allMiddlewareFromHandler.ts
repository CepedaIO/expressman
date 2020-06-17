import {RouteHandlerConstructor} from "../models/IRouteHandler";
import {NextFunction, Request, Response} from "express";
import Manifest, {Middleware} from "./Manifest";
import { flatten } from 'lodash';

function middlewareFromHandler(constructor:RouteHandlerConstructor, onResult?: (result:any, resp:Response) => void): Middleware {
  return async (req:Request, resp:Response, next:NextFunction) => {
    const container = resp.locals.container;
    const handler = container.resolve(constructor);

    try {
      const result = handler.handle(req, resp, container);
      resp.locals[constructor.name] = result;
      onResult && onResult(result, resp);
      next();
    } catch(err) {
      if(handler.catch) {
        try {
          const result = handler.catch(err);
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
    resp.locals['$route'] = result;
  }));

  if(Manifest.after.has(constructor)) {
    const afterRouteHandlers = Manifest.after.get(constructor)!;
    const afterMiddleware = afterRouteHandlers.map(handler => allMiddlewareFromHandler(handler));
    middleware.push(...flatten(afterMiddleware));
  }

  return middleware;
}