import {Application, Request, Response} from "express";
import * as path from "path";
import ContainerMiddleware from "../../middleware/ContainerMiddleware";
import {middlewareFromDescriptor, toExpressMiddleware} from "../middlewareFromDescriptor";
import {SendResponseMiddleware} from "../../middleware/SendResponseMiddleware";
import DependencyContainer from "tsyringe/dist/typings/types/dependency-container";
import {
  AnyNewable,
  IParentContainer,
  Middleware,
  Wrapperware
} from "../../types";
import {ErrorMiddleware} from "../../middleware/ErrorMiddleware";

export interface ManifestOptions {
  before?:Array<Middleware>;
  after?:Array<Middleware>;
  configureContainer?(container:DependencyContainer, request:Request, response:Response);
  onUncaughtException?(container:DependencyContainer, error: any): Promise<any>;
}

export class APIDescriptor {
  path: string = '/';
  filePath!: string;
  routes: Map<string, RouteDescriptor> = new Map();
  
  constructor(
    public target: AnyNewable
  ) { }
}

export class RouteDescriptor {
  public method!: string;
  public path: string = '';
  public before:Middleware[] = [];
  public after:Middleware[] = [];
  public wrap:Wrapperware[] = [];
  
  constructor(
    public property: string
  ) {
  }
}

class RouteMetadata {
  container:IParentContainer<any>;
  apis: Map<AnyNewable, APIDescriptor> = new Map();
  
  has(target:AnyNewable): boolean {
    return this.apis.has(target)
  }
  
  get(target:AnyNewable): APIDescriptor {
    if(!this.has(target)) {
      this.apis.set(target, new APIDescriptor(target));
    }
    
    return this.apis.get(target)!;
  }
  
  getRouteDescriptor(target:AnyNewable, property:string): RouteDescriptor {
    const apiDescriptor = this.get(target);
    
    if(!apiDescriptor.routes.has(property)) {
      apiDescriptor.routes.set(property, new RouteDescriptor(property))
    }
    
    return apiDescriptor.routes.get(property)!;
  }
  
  createAPI(target:AnyNewable, basePath:string, filePath:string) {
    const apiDescriptor = this.get(target);
    apiDescriptor.path = basePath;
    apiDescriptor.filePath = filePath;
  }
  
  createRoute(target:AnyNewable, property:string, method:string, path?:string) {
    const descriptor = this.getRouteDescriptor(target, property);
    descriptor.method = method.toLocaleLowerCase();
    
    if(path) { descriptor.path = path; }
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
      options.before
        .map((handler) => toExpressMiddleware(handler))
        .forEach((middleware) => app.use(middleware));
    }
    
    this.apis.forEach((apiDescriptor) => {
      apiDescriptor.routes.forEach((routeDescriptor) => {
        const url = path.normalize(`${apiDescriptor.path}/${routeDescriptor.path}`);
        app[routeDescriptor.method](url, middlewareFromDescriptor(apiDescriptor, routeDescriptor));
      });
    });
  
    if(options.after) {
      options.after
        .map((handler) => toExpressMiddleware(handler))
        .forEach((middleware) => app.use(middleware));
    }
    
    app.use(SendResponseMiddleware);
    app.use(ErrorMiddleware(options.onUncaughtException));
  }
}

export default new RouteMetadata();
