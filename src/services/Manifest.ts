import {Application, RequestHandler} from "express";
import ContainerMiddleware from "../middleware/ContainerMiddleware";
import {RouteHandlerConstructor} from "../models/IRouteHandler";
import {allMiddlewareFromHandler} from "./middlewareFromHandler";

export type Middleware = RequestHandler | Array<RequestHandler>;

interface HandlerEntry<U = any> {
  method:string;
  path:string;
  target:Newable<U>;
}

class Manifest {
  container:IParentContainer<any>;
  entries: { [key:string]:HandlerEntry } = {};

  recordHTTP(target:RouteHandlerConstructor, method:string, path:string) {
    debugger;
    this.entries[`${method} ${path}`] = {
      method,
      path,
      target
    };
  }

  generateRoutes<U>(app:Application, container:IParentContainer<U>) {
    this.container = container;

    Object.values(this.entries).forEach(entry => {
      app[entry.method.toLowerCase()](entry.path,
        ContainerMiddleware,
        allMiddlewareFromHandler(entry.target, container)
      );
    });
  }
}

export default new Manifest();
