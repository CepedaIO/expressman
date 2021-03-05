import {Middleware} from "../../types";
import RouteMetadata from "../../services/metadata/RouteMetadata";

export function Before(...middleware:Array<Middleware>) {
  return (target:any, property: string) => {
    RouteMetadata.setBefore(target.constructor, property, middleware);
  }
}
