import {Request} from "express";
import {InputMap} from "../types";
import { get } from "lodash";

export async function payloadFromMap(request:Request, inputMap:InputMap) {
  let valid = true;
  const payload = {};
  const errors:{ [propertyKey:string]:Error } = {};

  const promises = Object.entries(inputMap).map(async ([propertyKey, propertyMap]) => {
    const value = get(request, propertyMap.path);

    if(propertyMap.options) {
      if(propertyMap.options.validate) {
        try {
          await propertyMap.options.validate(value);
        } catch(err) {
          valid = false;
          errors[propertyMap.path.join('.')] = err;
        }
      }

      if(propertyMap.options.transform) {
        const transformed = propertyMap.options.transform(value);
        payload[propertyKey] = transformed;
      } else {
        payload[propertyKey] = value;
      }
    } else {
      payload[propertyKey] = value;
    }
  });

  return Promise.all(promises).then(() => {
    return { payload, errors, valid };
  });
}
