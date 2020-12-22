import Manifest from "../../services/Manifest";
import {Middleware, RouteHandlerConstructor} from "../../types";

export function Before(...handlers:Array<Middleware>) {
  return (target:RouteHandlerConstructor) => {
    Manifest.recordBefore(target, handlers);
  }
}
