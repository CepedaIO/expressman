import {injectable} from "tsyringe";
import RouteMetadata from "../../services/RouteMetadata";
import {AnyNewable} from "../../types";

export function API(basePath:string) {
  return (target:AnyNewable) => {
    injectable()(target);
    RouteMetadata.createAPI(target, basePath);
  }
}

export function Route(method:string, path:string) {
  return (target:any, property:string) => {
    RouteMetadata.createRoute(target.constructor, property, method, path);
  }
}

export function GET(path:string) {
  return Route('get', path);
}

export function POST(path:string) {
  return Route('post', path);
}

export function PUT(path:string) {
  return Route('put', path);
}

export function PATCH(path:string) {
  return Route('patch', path);
}

export function DELETE(path:string) {
  return Route('delete', path);
}
