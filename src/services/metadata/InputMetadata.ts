import {
  AnyNewable
} from "../../types";
import Dict = NodeJS.Dict;
import {MapOptions} from "../../decorators";

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
  inputs: Map<string, InputDescriptor> = new Map();
  
  get(target:string): InputDescriptor {
    return this.inputs.get(target)!;
  }
  
  createMap<InputType>(target:AnyNewable, property:string, path:string[], options:MapOptions) {
    if(!this.inputs.has(target.name)) {
      this.inputs.set(target.name, new InputDescriptor(target));
    }

    const descriptor = this.get(target.name);
    descriptor.propertyMap[property] = {
      ...options,
      path
    };
    
    this.inputs.set(target.name, descriptor);
  }
}

export default new InputMetadata();
