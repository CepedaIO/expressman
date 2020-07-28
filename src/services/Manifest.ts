import {Application, Request, RequestHandler, Response} from "express";
import ContainerMiddleware from "../middleware/ContainerMiddleware";
import {middlewareFromHandler} from "./middlewareFromHandler";
import {SendResponseMiddleware} from "../middleware/SendResponseMiddleware";
import DependencyContainer from "tsyringe/dist/typings/types/dependency-container";
import {InputMap, IParentContainer, Newable, PropertyMapOptions, RouteHandlerConstructor} from "../types";
import {ErrorMiddleware} from "../middleware/ErrorMiddleware";

export type Middleware = RequestHandler | Array<RequestHandler>;

interface HandlerEntry<U = any> {
  method:string;
  path:string;
  target:RouteHandlerConstructor;
}

export interface ManifestOptions {
  configureContainer?(container:DependencyContainer, request:Request, response:Response);
}

class Manifest {
  container:IParentContainer<any>;
  route: Map<string, HandlerEntry> = new Map();
  before: Map<RouteHandlerConstructor, RouteHandlerConstructor[]> = new Map();
  after: Map<RouteHandlerConstructor, RouteHandlerConstructor[]> = new Map();
  map: Map<Newable<any>, InputMap> = new Map();
  input: Map<RouteHandlerConstructor, Newable<any>> = new Map();

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

  recordMap<InputType>(target:any, propertyKey:string, options:PropertyMapOptions<InputType>) {
    const record = this.map.get(target) || {};
    record[propertyKey] = options;
    this.map.set(target, record);
  }

  recordInput(target:RouteHandlerConstructor, mapConstructor:Newable<any>) {
    this.input.set(target, mapConstructor);
  }

  generateRoutes(app:Application, options:ManifestOptions = {}) {
    app.use(ContainerMiddleware(options));

    this.route.forEach(entry => {
      const method = entry.method.toLowerCase();
      app[method](entry.path, middlewareFromHandler(entry.target));
    });

    app.use(SendResponseMiddleware);
    app.use(ErrorMiddleware);
  }

  getInputClass(constructor:RouteHandlerConstructor): Newable<any> | undefined {
    return this.input.get(constructor);
  }

  getInputMap(constructor:RouteHandlerConstructor): InputMap | undefined {
    const mapConstructor = this.input.get(constructor);

    if(!mapConstructor) {
      return undefined;
    }

    return this.map.get(mapConstructor);
  }
}

export default new Manifest();
