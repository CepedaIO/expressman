import {RequestHandler, Response} from "express";
import Manifest from "./Manifest";
import { flatten } from 'lodash';
import {Middleware, RouteHandlerConstructor, Wrapperware} from "../types";
import {HandlerMiddleware} from "../middleware/HandlerMiddleware";

function isRequestHandler(obj: any): obj is RequestHandler {
  return obj.constructor !== undefined
}

export function toExpressMiddleware(middleware: Middleware): Array<RequestHandler> {
  if(isRequestHandler(middleware)) {
    return [ middleware ];
  }

  return middlewareFromHandler(middleware);
}

export function middlewareFromHandler(constructor:RouteHandlerConstructor, wrappers?: Array<Wrapperware>): Array<RequestHandler> {
  const middleware:Array<RequestHandler> = [];

  if(Manifest.before.has(constructor)) {
    const beforeRouteHandlers = Manifest.before.get(constructor)!;
    const beforeMiddleware = beforeRouteHandlers.map(handler => toExpressMiddleware(handler));
    middleware.push(...flatten(beforeMiddleware));
  }

  middleware.push(HandlerMiddleware(constructor, wrappers,(result, resp:Response) => {
    resp.locals['$response'] = result;
  }));

  if(Manifest.after.has(constructor)) {
    const afterRouteHandlers = Manifest.after.get(constructor)!;
    const afterMiddleware = afterRouteHandlers.map(handler => toExpressMiddleware(handler));
    middleware.push(...flatten(afterMiddleware));
  }

  return middleware;
}
