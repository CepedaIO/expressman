import {Request} from "express";
import {InputMap, Pairs} from "../types";
import { get, capitalize, isFunction, reject } from "lodash";

export async function payloadFromMap(request:Request, inputMap:InputMap) {
  let valid = true;
  const payload = {};
  const errorPairs:Pairs<Error> = {};

  const promises = Object.entries(inputMap).map(async ([propertyKey, propertyMap]) => {
    const value = get(request, propertyMap.path);

    if(propertyMap.options) {
      if(propertyMap.options.validate) {
        let validateTail:Promise<true | { reject:any }> = Promise.resolve(true);
        propertyMap.options.validate.forEach((rule) => {
          validateTail = validateTail.then(async (previousResult) => {
            const validateRule = isFunction(rule) ? rule() : rule;
            const label = validateRule.modifiers?.label || propertyKey;
            const reject = validateRule.modifiers?.reject || validateRule.reject;

            if(previousResult === true) {
              let input = value;
              if(typeof value === 'undefined' || value === null) {
                if(propertyMap.options.default) {
                  input = propertyMap.options.default;
                } else if(propertyMap.options.optional === true) {
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
          errorPairs[propertyMap.path.join('.')] = result.reject;
        }
      }

      payload[propertyKey] = propertyMap.options.transform && valid == true ? propertyMap.options.transform(value) : value;
    } else {
      payload[propertyKey] = value;
    }
  });

  return Promise.all(promises).then(() => {
    return { payload, errorPairs, valid };
  });
}
