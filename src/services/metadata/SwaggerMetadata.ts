import {
  AnyNewable
} from "../../types";

export class SwaggerAPIDescriptor {
  public routes: Map<string, SwaggerRouteDescriptor> = new Map();
  
  constructor(
    public target:AnyNewable
  ) { }
}

export class SwaggerRouteDescriptor {
  public input!:AnyNewable;
  public output!:AnyNewable;
  
  constructor(
    public property: string
  ) { }
}

class InputMetadata {
  swaggers: Map<AnyNewable, SwaggerAPIDescriptor> = new Map();
  
  get(target:AnyNewable): SwaggerAPIDescriptor {
    if(!this.swaggers.has(target)) {
      this.swaggers.set(target, new SwaggerAPIDescriptor(target));
    }
    
    return this.swaggers.get(target)!;
  }
  
  getRouteDescriptor(target:AnyNewable, property:string): SwaggerRouteDescriptor {
    const api = this.get(target);
    
    if(!api.routes.has(property)) {
      api.routes.set(property, new SwaggerRouteDescriptor(property))
    }
    
    return api.routes.get(property)!;
  }
  
  createSwagger<InputType>(target:AnyNewable, property:string, input:AnyNewable, output:AnyNewable) {
    const routeDescriptor = this.getRouteDescriptor(target, property);
    routeDescriptor.input = input;
    routeDescriptor.output = output;
    routeDescriptor.property = property;
  }
}

export default new InputMetadata();
