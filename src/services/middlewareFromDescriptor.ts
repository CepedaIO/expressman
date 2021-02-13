import {RequestHandler} from "express";
import {RouteDescriptor} from "./RouteMetadata";
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
  //return middlewareFromHandler(descriptor, middleware);
}

export function middlewareFromDescriptor(descriptor: RouteDescriptor): Array<RequestHandler> {
  const middleware:Array<RequestHandler> = [];
  
  const beforeMiddleware = descriptor.before.map(handler => toExpressMiddleware(handler));
  const handler = RouteMiddleware(descriptor, (result, resp) => {
    resp.locals['$response'] = result;
  })
  const afterMiddleware = descriptor.after.map(handler => toExpressMiddleware(handler));
  
  middleware.push(...flatten(beforeMiddleware), handler, ...flatten(afterMiddleware));

  return middleware;
}
