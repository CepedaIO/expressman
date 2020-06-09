import {ROUTE_KEY} from "../constants";

export function Route(method:string, path:string) {
  return (target) => {
    Reflect.defineMetadata(ROUTE_KEY, { method, path }, target);
  }
}