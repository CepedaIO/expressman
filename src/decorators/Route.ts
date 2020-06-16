import Manifest from "../services/Manifest";
import {IRouteHandler} from "../models/IRouteHandler";

export function Route(method:string, path:string) {
  return (target:Newable<IRouteHandler<any, any>>) => {
    Manifest.recordHTTP(target, method, path);
  }
}