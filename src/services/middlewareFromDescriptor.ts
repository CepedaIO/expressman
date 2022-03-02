import {RequestHandler} from "express";
import {APIDescriptor, RouteDescriptor} from "./metadata/RouteMetadata";
import { flatten } from 'lodash';
import {Middleware} from "../types";
import {RouteMiddleware} from "../middleware/RouteMiddleware";

function isRequestHandler(obj: any): obj is RequestHandler {
  return obj.constructor !== undefined
}

export function toExpressMiddleware(middleware: Middleware): Array<RequestHandler> {
  if(isRequestHandler(middleware)) {
    return [ middleware ];
  }

  throw new Error('RouteHandler as Middleware is not supported yet');
}

export function middlewareFromDescriptor(api: APIDescriptor, route: RouteDescriptor): Array<RequestHandler> {
  const beforeMiddleware = route.before.map(handler => toExpressMiddleware(handler));
  const afterMiddleware = route.after.map(handler => toExpressMiddleware(handler));

  return [
    ...flatten(beforeMiddleware),
    RouteMiddleware(api, route),
    ...flatten(afterMiddleware)
  ];
}
