import Manifest from "../../services/Manifest";
import {Middleware, RouteHandlerConstructor} from "../../types";

export function After(...handlers:Array<Middleware>) {
  return (target:RouteHandlerConstructor) => {
    Manifest.recordAfter(target, handlers);
  }
}
