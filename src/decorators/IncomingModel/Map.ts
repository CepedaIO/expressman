import Manifest from "../../services/Manifest";
import { kebabCase } from 'lodash';

export interface MapOptions {
  transform?(input:any): any;
  validate?(input:any): any;
}

export function Map(path:string[], options:MapOptions = {}) {
  return (target:any, propertyKey: string) => {
    if(path.length === 1) {
      path.push(kebabCase(propertyKey));
    }

    Manifest.recordMap(target.constructor, propertyKey, { path, options });
  }
}
function createMap(requestKey:string, options:MapOptions);
function createMap(requestKey:string, key?:string, options?:MapOptions);
function createMap(requestKey:string, key?:any, options?:any) {
  const path = [requestKey];

  if(typeof key === 'string') {
    path.push(key);
    return Map(path, options);
  }

  return Map(path, key);
}
export function Query(options?:MapOptions);
export function Query(key:string, options?:MapOptions);
export function Query(key?:any, options?:any) {
  return createMap('query', key, options);
}

export function Body(options?:MapOptions);
export function Body(key:string, options?:MapOptions);
export function Body(key?:any, options?:any) {
  return createMap('body', key, options);
}

export function Header(options?:MapOptions);
export function Header(key:string, options?:MapOptions);
export function Header(key?:any, options?:any) {
  return createMap('headers', key, options);
}

export function Cookie(options?:MapOptions);
export function Cookie(key:string, options?:MapOptions);
export function Cookie(key?:any, options?:any) {
  return createMap('cookies', key, options);
}

export function Param(options?:MapOptions);
export function Param(key:string, options?:MapOptions);
export function Param(key?:any, options?:any) {
  return createMap('params', key, options);
}
