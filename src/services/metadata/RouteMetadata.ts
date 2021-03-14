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
import * as TJS from "typescript-json-schema";
import gatherSymbols, {FileSymbols} from "../../utils/gatherSymbols";

interface MetadataOptions {
  path?: string;
}

export interface ManifestOptions {
  pattern: string;
  metadata?: MetadataOptions;
  before?:Array<Middleware>;
  after?:Array<Middleware>;
  configureContainer?(container:DependencyContainer, request:Request, response:Response);
  onUncaughtException?(container:DependencyContainer, error: any): Promise<any>;
}

export class APIDescriptor {
  path: string = '/';
  filePath!: string;
  symbols: FileSymbols;
  routes: Map<string, RouteDescriptor> = new Map();
  
  constructor(
    public target: AnyNewable
  ) { }
}

interface RouteSchema {
  method: string;
  path: string;
  input?: {
    name: string;
    schema: any;
  };
  output?: {
    name: string;
    schema: any;
  };
}

export class RouteDescriptor {
  public schema:RouteSchema = {
    method: '',
    path: '/'
  };
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
    apiDescriptor.symbols = gatherSymbols(apiDescriptor.filePath);
  }
  
  createRoute(target:AnyNewable, property:string, options:Omit<RouteSchema, 'input' | 'output'> & { input?:string; output?:string; }) {
    const descriptor = this.getRouteDescriptor(target, property);
    descriptor.schema = {
      method: options.method.toLocaleLowerCase(),
      path: options.path
    };
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

  async generateRoutes(app:Application, program:TJS.Program, options:ManifestOptions) {
    await this.generateSchemas(program);
    
    app.use(ContainerMiddleware(options));

    if(options.before) {
      options.before
        .map((handler) => toExpressMiddleware(handler))
        .forEach((middleware) => app.use(middleware));
    }
    
    this.apis.forEach((apiDescriptor) => {
      apiDescriptor.routes.forEach((routeDescriptor) => {
        const url = path.normalize(`${apiDescriptor.path}/${routeDescriptor.schema.path}`);
        app[routeDescriptor.schema.method](url, middlewareFromDescriptor(apiDescriptor, routeDescriptor));
      });
    });
  
    if(options.after) {
      options.after
        .map((handler) => toExpressMiddleware(handler))
        .forEach((middleware) => app.use(middleware));
    }
  
    app.get(options.metadata?.path || '/expressman', (req: Request, resp: Response, next) => {
      resp.send(this.toDTO());
    });
    
    app.use(SendResponseMiddleware);
    app.use(ErrorMiddleware(options.onUncaughtException));
  }
  
  async generateSchemas(program:TJS.Program) {
    const generator = TJS.buildGenerator(program)!;
    
    this.apis.forEach((api) => {
      api.routes.forEach((route) => {
        const symbols = api.symbols.methods.get(route.property) || {};
        
        if (symbols.arg) {
          route.schema.input = {
            name: symbols.arg,
            schema: generator.getSchemaForSymbol(symbols.arg)
          };
        }
        
        if (symbols.return) {
          route.schema.output = {
            name: symbols.return,
            schema: generator.getSchemaForSymbol(symbols.return)
          };
        }
      });
    })
  }
  
  toDTO(): any {
    const dto = {};
    
    this.apis.forEach((api) => {
      api.routes.forEach((route) => {
        const url = path.normalize(`${api.path}/${route.schema.path}`).replace(/\/$/, '');
        dto[url] = {
          ...dto[url],
          [route.schema.method]: route.schema
        }
      });
    });
    
    return dto;
  }
}

export default new RouteMetadata();
