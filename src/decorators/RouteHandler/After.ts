import {Middleware} from "../../types";
import RouteMetadata from "../../services/RouteMetadata";

export function After(...middleware:Array<Middleware>) {
  return (target:any, property: string) => {
    RouteMetadata.setAfter(target, property, middleware);
  }
}
