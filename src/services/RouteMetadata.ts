import {Application, Request, Response} from "express";
import ContainerMiddleware from "../middleware/ContainerMiddleware";
import {middlewareFromDescriptor, toExpressMiddleware} from "./middlewareFromDescriptor";
import {SendResponseMiddleware} from "../middleware/SendResponseMiddleware";
import DependencyContainer from "tsyringe/dist/typings/types/dependency-container";
import {
  AnyNewable,
  IParentContainer,
  Middleware,
  Wrapperware
} from "../types";
import {ErrorMiddleware} from "../middleware/ErrorMiddleware";
import Dict = NodeJS.Dict;

export interface ManifestOptions {
  before?:Array<Middleware>;
  after?:Array<Middleware>;
  configureContainer?(container:DependencyContainer, request:Request, response:Response);
  onUncaughtException?(container:DependencyContainer, error: any): Promise<any>;
}

export class RouteDescriptor {
  public method!: string;
  public path!: string;
  public before:Middleware[] = [];
  public after:Middleware[] = [];
  public wrap:Wrapperware[] = [];
  
  constructor(
    public target: AnyNewable,
    public property: string
  ) {
  }
}


class RouteMetadata {
  container:IParentContainer<any>;
  routes: Map<AnyNewable, Dict<RouteDescriptor>> = new Map();
  
  has(target:AnyNewable): boolean {
    return this.routes.has(target)
  }
  
  get(target:AnyNewable): Dict<RouteDescriptor> {
    if(!this.has(target)) {
      this.routes.set(target, {});
    }
    
    return this.routes.get(target)!;
  }
  
  getRouteDescriptor(target:AnyNewable, property:string): RouteDescriptor {
    const routeDict = this.get(target);
    if(!routeDict[property]) {
      routeDict[property] = new RouteDescriptor(target, property);
    }
    
    return routeDict[property]!;
  }
  
  createRoute(target:AnyNewable, property:string, method:string, path:string) {
    const descriptor = this.getRouteDescriptor(target, property);
    descriptor.method = method;
    descriptor.path = path;
  }

  setBefore(target:AnyNewable, property:string, middleware:Array<Middleware>) {
    const descriptor = this.getRouteDescriptor(target, property);
    descriptor.before = middleware;
  }

  setAfter(target:AnyNewable, property:string, middleware:Array<Middleware>) {
    const descriptor = this.getRouteDescriptor(target, property);
    descriptor.after = middleware;
  }

  setWrap(target:AnyNewable, property:string, wrapperware:Array<Wrapperware>) {
    const descriptor = this.getRouteDescriptor(target, property);
    descriptor.wrap = wrapperware;
  }

  generateRoutes(app:Application, options:ManifestOptions = {}) {
    app.use(ContainerMiddleware(options));

    if(options.before) {
      const beforeMiddleware = options.before.map((handler) => toExpressMiddleware(handler));
      beforeMiddleware.forEach((middleware) => {
        app.use(middleware);
      });
    }
    
    this.routes.forEach((descriptorDict) => {
      Object.entries(descriptorDict).forEach(([property, descriptor]) => {
        if(!descriptor) {
          throw new Error(`No descriptor found for ${property}`);
        }
        
        app[descriptor.method](descriptor.path, middlewareFromDescriptor(descriptor));
      });
    });
  
    if(options.after) {
      const afterMiddleware = options.after.map((handler) => toExpressMiddleware(handler));
      afterMiddleware.forEach((middleware) => {
        app.use(middleware);
      });
    }
    
    app.use(SendResponseMiddleware);
    app.use(ErrorMiddleware(options.onUncaughtException));
  }
}

export default new RouteMetadata();
