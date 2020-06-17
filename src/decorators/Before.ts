import {RouteHandlerConstructor} from "../models/IRouteHandler";
import Manifest from "../services/Manifest";

export function Before(...handlers:RouteHandlerConstructor[]) {
  return (target:RouteHandlerConstructor) => {
    Manifest.recordBefore(target, handlers);
  }
}