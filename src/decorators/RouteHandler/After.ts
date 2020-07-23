import Manifest from "../../services/Manifest";
import {RouteHandlerConstructor} from "../../types";

export function After(...handlers:RouteHandlerConstructor[]) {
  return (target:RouteHandlerConstructor) => {
    Manifest.recordAfter(target, handlers);
  }
}
