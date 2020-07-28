import {Response} from "express";
import Manifest, {Middleware} from "./Manifest";
import { flatten } from 'lodash';
import {RouteHandlerConstructor} from "../types";
import {HandlerMiddleware} from "../middleware/HandlerMiddleware";

export function middlewareFromHandler(constructor:RouteHandlerConstructor): Middleware[] {
  const middleware:Middleware[] = [];

  if(Manifest.before.has(constructor)) {
    const beforeRouteHandlers = Manifest.before.get(constructor)!;
    const beforeMiddleware = beforeRouteHandlers.map(handler => middlewareFromHandler(handler));
    middleware.push(...flatten(beforeMiddleware));
  }

  middleware.push(HandlerMiddleware(constructor, (result, resp:Response) => {
    resp.locals['$response'] = result;
  }));

  if(Manifest.after.has(constructor)) {
    const afterRouteHandlers = Manifest.after.get(constructor)!;
    const afterMiddleware = afterRouteHandlers.map(handler => middlewareFromHandler(handler));
    middleware.push(...flatten(afterMiddleware));
  }

  return middleware;
}
