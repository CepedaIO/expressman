import {Application, Request, Response} from "express";
import * as path from "path";
import ContainerMiddleware from "../../middleware/ContainerMiddleware";
import {middlewareFromDescriptor, toExpressMiddleware} from "../middlewareFromDescriptor";
import {SendResponseMiddleware} from "../../middleware/SendResponseMiddleware";
import {
  AnyNewable,
  IParentContainer,
  Middleware,
  Wrapperware
} from "../../types";
import {ErrorMiddleware} from "../../middleware/ErrorMiddleware";
import * as TJS from "typescript-json-schema";
import gatherSymbols, {FileSymbols} from "../../utils/gatherSymbols";
import {programFor} from "../generateSwagger";
import bodyParser from "body-parser";
import {PublishOptions} from "../publish";

export class APIDescriptor {
  path: string = '/';
  filePath!: string;
  symbols: FileSymbols;
  methods: Map<string, RouteDescriptor> = new Map();
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

export function urlFrom(api:APIDescriptor, route:RouteDescriptor) {
  return path.normalize(`${api.path}/${route.schema.path}`).replace(/\/$/, '');
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
    const api = this.get(target);
    
    if(!api.methods.has(property)) {
      const route = new RouteDescriptor(property);
      api.methods.set(property, route);
      api.routes.set(urlFrom(api, route), route);
    }
    
    return api.methods.get(property)!;
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

  async generateRoutes(app:Application, options:PublishOptions) {
    if(options.bodyparser !== false) {
      app.use(bodyParser.urlencoded({ extended: false }));
      app.use(bodyParser.json());
    }

    if(options.before) {
      options.before
        .map((handler) => toExpressMiddleware(handler))
        .forEach((middleware) => app.use(middleware));
    }
    
    this.apis.forEach((apiDescriptor) => {
      apiDescriptor.methods.forEach((routeDescriptor) => {
        const url = path.normalize(`${apiDescriptor.path}/${routeDescriptor.schema.path}`);
        const routeHandlerMiddleware = middlewareFromDescriptor(apiDescriptor, routeDescriptor);
        app[routeDescriptor.schema.method](url, [
          ContainerMiddleware(options),
          ...routeHandlerMiddleware,
          SendResponseMiddleware,
          ErrorMiddleware(options.onUncaughtException)
        ]);
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
  }
  
  async generateSchemas(pattern:string) {
    const program = await programFor(pattern)
    const generator = TJS.buildGenerator(program)!;

    if(!generator) {
      console.log('Unable to generate schema, errors likely encountered');
      return;
    }
    
    this.apis.forEach((api) => {
      api.methods.forEach((route) => {
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
      api.methods.forEach((route) => {
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
