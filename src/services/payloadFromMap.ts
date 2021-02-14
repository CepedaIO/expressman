import {Request} from "express";
import {Pairs} from "../types";
import { get } from "lodash";
import {InputDescriptor} from "./metadata/InputMetadata";

export async function payloadFromMap(descriptor:InputDescriptor, request:Request) {
  let valid = true;
  const payload = {};
  const errorPairs:Pairs<Error> = {};
  
  const promises = Object.entries(descriptor.propertyMap).map(async ([propertyKey, propDescriptor]) => {
    if(!propDescriptor){
      throw new Error(`No InputPropDescriptor found for ${propertyKey}`);
    }
    
    let value = get(request, propDescriptor.path);
    
    if(propDescriptor.default !== undefined) {
      if(value === undefined || value === null) {
        value = propDescriptor.default;
      }
    }
    
    if(propDescriptor.validate) {
      let validateTail:Promise<true | { reject:any }> = Promise.resolve(true);
  
      propDescriptor.validate.forEach((rule) => {
        validateTail = validateTail.then(async (previousResult) => {
          const validateRule = rule();
          const label = validateRule.modifiers?.label || propertyKey;
          const reject = validateRule.modifiers?.reject || validateRule.reject;
      
          if(previousResult === true) {
            if(typeof value === 'undefined' || value === null) {
              if(propDescriptor.optional === true) {
                return true;
              } else {
                return { reject:reject(value, label) };
              }
            }
        
            const valid = await validateRule.valid(value);
            if(!valid) {
              return { reject:reject(value, label) };
            }
        
            return true;
          }
      
          return previousResult;
        });
      });
  
      const result = await validateTail;
  
      if(result !== true) {
        valid = false;
        errorPairs[propDescriptor.path.join('.')] = result.reject;
      }
    }
    
    payload[propertyKey] = value;
    
    if(valid && propDescriptor.transform) {
      payload[propertyKey] = propDescriptor.transform(value);
    }
  });

  return Promise.all(promises).then(() => {
    return { payload, errorPairs, valid };
  });
}
