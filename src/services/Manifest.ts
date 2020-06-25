import {Application, Request, RequestHandler, Response} from "express";
import ContainerMiddleware from "../middleware/ContainerMiddleware";
import {RouteHandlerConstructor} from "../models/IRouteHandler";
import {allMiddlewareFromHandler} from "./allMiddlewareFromHandler";
import {SendResponseMiddleware} from "../middleware/SendResponseMiddleware";
import DependencyContainer from "tsyringe/dist/typings/types/dependency-container";

export type Middleware = RequestHandler | Array<RequestHandler>;

interface HandlerEntry<U = any> {
  method:string;
  path:string;
  target:RouteHandlerConstructor;
}

export interface ManifestOptions {
  prehandle?(container:DependencyContainer, request:Request, response:Response);
}

class Manifest {
  container:IParentContainer<any>;
  route: Map<string, HandlerEntry> = new Map();
  before: Map<RouteHandlerConstructor, RouteHandlerConstructor[]> = new Map();
  after: Map<RouteHandlerConstructor, RouteHandlerConstructor[]> = new Map();

  recordRoute(target:RouteHandlerConstructor, method:string, path:string) {
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

  generateRoutes(app:Application, options:ManifestOptions = {}) {
    app.use(ContainerMiddleware(options));

    this.route.forEach(entry => {
      const method = entry.method.toLowerCase();
      app[method](entry.path, allMiddlewareFromHandler(entry.target));
    });

    app.use(SendResponseMiddleware);
  }
}

export default new Manifest();
