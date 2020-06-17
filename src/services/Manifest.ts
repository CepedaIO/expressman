import {Application, RequestHandler} from "express";
import ContainerMiddleware from "../middleware/ContainerMiddleware";
import {RouteHandlerConstructor} from "../models/IRouteHandler";
import {allMiddlewareFromHandler} from "./allMiddlewareFromHandler";
import {SendResponseMiddleware} from "../middleware/SendResponseMiddleware";

export type Middleware = RequestHandler | Array<RequestHandler>;

interface HandlerEntry<U = any> {
  method:string;
  path:string;
  target:Newable<U>;
}

class Manifest {
  container:IParentContainer<any>;
  route: Map<string, HandlerEntry> = new Map();
  before: Map<RouteHandlerConstructor, RouteHandlerConstructor[]> = new Map();
  after: Map<RouteHandlerConstructor, RouteHandlerConstructor[]> = new Map();

  recordHTTP(target:RouteHandlerConstructor, method:string, path:string) {
    this.route.set(`${method} ${path}`, {
      method,
      path,
      target
    });
  }

  recordBefore(target:RouteHandlerConstructor, middleware:RouteHandlerConstructor[]) {
    this.before.set(target, middleware);
  }

  recordAfter(target:RouteHandlerConstructor, middleware:RouteHandlerConstructor[]) {
    this.after.set(target, middleware);
  }

  generateRoutes<U>(app:Application, container:IParentContainer<U>) {
    this.container = container;

    app.use(ContainerMiddleware);

    this.route.forEach(entry => {
      const method = entry.method.toLowerCase();
      app[method](entry.path, allMiddlewareFromHandler(entry.target, container));
    });

    app.use(SendResponseMiddleware);
  }
}

export default new Manifest();
