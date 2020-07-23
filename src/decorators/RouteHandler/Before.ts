import Manifest from "../../services/Manifest";
import {RouteHandlerConstructor} from "../../types";

export function Before(...handlers:RouteHandlerConstructor[]) {
  return (target:RouteHandlerConstructor) => {
    Manifest.recordBefore(target, handlers);
  }
}
