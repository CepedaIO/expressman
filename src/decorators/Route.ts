import Manifest from "../services/Manifest";
import {RouteHandlerConstructor} from "../models/IRouteHandler";
import {injectable} from "tsyringe";
import {RouteHandlerConstructor} from "../types";

export function Route(method:string, path:string) {
  return (target:RouteHandlerConstructor) => {
    injectable()(target);
    Manifest.recordRoute(target, method, path);
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
