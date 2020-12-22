import {Application, Request, Response} from "express";
import ContainerMiddleware from "../middleware/ContainerMiddleware";
import {middlewareFromHandler, toExpressMiddleware} from "./middlewareFromHandler";
import {SendResponseMiddleware} from "../middleware/SendResponseMiddleware";
import DependencyContainer from "tsyringe/dist/typings/types/dependency-container";
import {
  InputMap,
  IParentContainer,
  Middleware,
  Newable,
  PropertyMapOptions,
  RouteHandlerConstructor,
  Wrapperware
} from "../types";
import {ErrorMiddleware} from "../middleware/ErrorMiddleware";

interface HandlerEntry<U = any> {
  method:string;
  path:string;
  target:RouteHandlerConstructor;
}

export interface ManifestOptions {
  before?:Array<Middleware>;
  after?:Array<Middleware>;
  configureContainer?(container:DependencyContainer, request:Request, response:Response);
  onUncaughtException?(container:DependencyContainer, error: any): Promise<any>;
}

class Manifest {
  container:IParentContainer<any>;
  route: Map<string, HandlerEntry> = new Map();
  before: Map<RouteHandlerConstructor, Array<Middleware>> = new Map();
  after: Map<RouteHandlerConstructor, Array<Middleware>> = new Map();
  wrap: Map<RouteHandlerConstructor, Array<Wrapperware>> = new Map();
  map: Map<Newable<any>, InputMap> = new Map();
  input: Map<RouteHandlerConstructor, Newable<any>> = new Map();

  recordRoute(target:RouteHandlerConstructor, method:string, path:string) {
    this.route.set(`${method} ${path}`, {
      method,
      path,
      target
    });
  }

  recordBefore(target:RouteHandlerConstructor, middleware:Array<Middleware>) {
    this.before.set(target, middleware);
  }

  recordAfter(target:RouteHandlerConstructor, middleware:Array<Middleware>) {
    this.after.set(target, middleware);
  }

  recordWrap(target:RouteHandlerConstructor, wrapperware:Array<Wrapperware>) {
    this.wrap.set(target, wrapperware);
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

    if(options.before) {
      const beforeMiddleware = options.before.map((handler) => toExpressMiddleware(handler));
      beforeMiddleware.forEach((middleware) => {
        app.use(middleware);
      });
    }
    this.route.forEach(entry => {
      const method = entry.method.toLowerCase();
      const wrappers = this.wrap.get(entry.target)
      const middleware = middlewareFromHandler(entry.target, wrappers);
      app[method](entry.path, middleware);
    });

    app.use(SendResponseMiddleware);
    app.use(ErrorMiddleware(options.onUncaughtException));
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
