import {RouteHandlerConstructor} from "../models/IRouteHandler";
import {NextFunction, Request, Response} from "express";
import {Middleware} from "./Manifest";

function middlewareFromHandler(constructor:RouteHandlerConstructor): Middleware {
  return async (req:Request, resp:Response, next:NextFunction) => {
    const container = resp.locals.container;
    const handler = container.resolve(constructor);

    try {
      resp.locals[constructor.name] = handler.handle(req, resp, container);
      next();
    } catch(err) {
      if(handler.catch) {
        try {
          resp.locals[constructor.name] = handler.catch(err);
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

export function allMiddlewareFromHandler(constructor:RouteHandlerConstructor, container:IChildContainer<any>): {} {
  const beforeMiddleware = !constructor.before ? [] : constructor.before.map(handlerConstructor => allMiddlewareFromHandler(handlerConstructor, container));
  const afterMiddleware = !constructor.after? [] : constructor.after.map(handlerConstructor => allMiddlewareFromHandler(handlerConstructor, container));

  return [
    ...beforeMiddleware,
    middlewareFromHandler(constructor),
    ...afterMiddleware,
    (req:Request, resp:Response, next:NextFunction) => {
      const result = resp.locals[constructor.name];

      if(typeof result !== 'undefined') {
        resp.status(result.statusCode || 200)
          .contentType(result.contentType || 'application/json')
          .send(result.body || result);
      }

      next();
    }
  ];
}