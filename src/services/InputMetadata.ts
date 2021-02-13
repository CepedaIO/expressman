import {
  AnyNewable
} from "../types";
import Dict = NodeJS.Dict;
import {MapOptions} from "../decorators";

type IInputProperyDescriptor = MapOptions & {
  path: string[];
}

export class InputDescriptor {
  public propertyMap:Dict<IInputProperyDescriptor> = {};
  
  constructor(
    public target:AnyNewable
  ) { }
}

class InputMetadata {
  inputs: Map<AnyNewable, InputDescriptor> = new Map();
  
  get(target:AnyNewable): InputDescriptor {
    if(!this.inputs.has(target)) {
      this.inputs.set(target, new InputDescriptor(target));
    }
    
    return this.inputs.get(target)!;
  }
  
  createMap<InputType>(target:AnyNewable, property:string, path:string[], options:MapOptions) {
    const descriptor = this.get(target as AnyNewable);
    descriptor.propertyMap[property] = {
      ...options,
      path
    };
    
    this.inputs.set(target, descriptor);
  }
}

export default new InputMetadata();
