import {AnyNewable, Wrapperware} from "../../types";
import RouteMetadata from "../../services/RouteMetadata";

export function Wrap(...wrappers:Array<Wrapperware>) {
  return (target:AnyNewable, property:string) => {
    RouteMetadata.setWrap(target, property, wrappers);
  }
}
