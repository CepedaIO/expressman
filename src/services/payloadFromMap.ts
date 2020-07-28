import {Request} from "express";
import {InputMap, Pairs} from "../types";
import { get } from "lodash";

export async function payloadFromMap(request:Request, inputMap:InputMap) {
  let valid = true;
  const payload = {};
  const errorPairs:Pairs<Error> = {};

  const promises = Object.entries(inputMap).map(async ([propertyKey, propertyMap]) => {
    const value = get(request, propertyMap.path);

    if(propertyMap.options) {
      if(propertyMap.options.validate) {
        try {
          await propertyMap.options.validate(value);
        } catch(err) {
          valid = false;
          errorPairs[propertyMap.path.join('.')] = err;
        }
      }

      payload[propertyKey] = propertyMap.options.transform ? propertyMap.options.transform(value) : value;
    } else {
      payload[propertyKey] = value;
    }
  });

  return Promise.all(promises).then(() => {
    return { payload, errorPairs, valid };
  });
}
