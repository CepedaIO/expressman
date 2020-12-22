import Manifest from "../../services/Manifest";
import {RouteHandlerConstructor, Wrapperware} from "../../types";

export function Wrap(...wrappers:Array<Wrapperware>) {
  return (target:RouteHandlerConstructor) => {
    Manifest.recordWrap(target, wrappers);
  }
}
