import {injectable} from "tsyringe";
import RouteMetadata from "../../services/metadata/RouteMetadata";
import {AnyNewable} from "../../types";
import callsites from "callsites";

export function API(basePath:string) {
  const filePath = callsites()[1].getFileName();
  
  if(!filePath) {
    throw new Error('Unable to determine callsite');
  }
  
  return (target:AnyNewable) => {
    injectable()(target);

    RouteMetadata.createAPI(target, basePath, filePath);
  }
}

export function Route(method:string, path?:string) {
  return (target:any, property:string) => {
    const paramTypes = Reflect.getMetadata("design:paramtypes", target, property);
    const returnType = Reflect.getMetadata("design:returntype", target, property);
  
    const input = paramTypes[0] && paramTypes[0].name !== "Object" ? paramTypes[0] : undefined;
    const output = returnType && returnType.name !== "Object" ? returnType : undefined;

    RouteMetadata.createRoute(target.constructor, property, { method, path: path || '/', input, output });
  }
}

export function GET(path?:string) {
  return Route('get', path);
}

export function POST(path?:string) {
  return Route('post', path);
}

export function PUT(path?:string) {
  return Route('put', path);
}

export function PATCH(path?:string) {
  return Route('patch', path);
}

export function DELETE(path?:string) {
  return Route('delete', path);
}
