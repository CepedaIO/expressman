import {Request} from "express";
import {InputMap} from "../types";
import { get } from "lodash";

export async function payloadFromMap(request:Request, inputMap:InputMap) {
  const payload = {};
  const errors:Error[]   = [];

  const promises = Object.entries(inputMap).map(async ([propertyKey, propertyMap]) => {
    const value = get(request, propertyMap.path);

    if(propertyMap.options && propertyMap.options.transform) {
      let transformed

      if(propertyMap.options.transform) {
        transformed = propertyMap.options.transform(value);
        payload[propertyKey] = transformed;
      }

      if(propertyMap.options.validate) {
        try {
          await propertyMap.options.validate(value, transformed);
        } catch(err) {
          errors.push(err);
        }
      }
    } else {
      payload[propertyKey] = value;
    }
  });

  return Promise.all(promises).then(() => {
    return { payload, errors };
  });
}
