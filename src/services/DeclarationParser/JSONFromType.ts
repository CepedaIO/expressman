import {Type} from "ts-morph";
import {Tracker} from "./Tracker";
import {JSONFromProperties} from "./JSONFromProperties";
import {JSONFromPrimitive} from "./JSONFromPrimitive";

export function JSONFromType(type: Type, tracker?:Tracker) {
  if(type.isInterface() || type.isObject()) {
    return JSONFromProperties(type.getProperties(), tracker);
  }

  return JSONFromPrimitive(type);
}