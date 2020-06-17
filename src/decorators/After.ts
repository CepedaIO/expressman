import {RouteHandlerConstructor} from "../models/IRouteHandler";
import Manifest from "../services/Manifest";

export function After(...handlers:RouteHandlerConstructor[]) {
  return (target:RouteHandlerConstructor) => {
    Manifest.recordAfter(target, handlers);
  }
}