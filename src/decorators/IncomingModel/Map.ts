import Manifest from "../../services/Manifest";
import { kebabCase } from 'lodash';

export interface MapOptions<InputType = any, TransformType = any> {
  transform?(input:InputType): TransformType;
  validate?(input:InputType): void | Promise<void>;
}

export function Map<InputType = string>(path:string[], options:MapOptions<InputType> = {}) {
  return (target:any, propertyKey: string) => {
    if(path.length === 1) {
      path.push(kebabCase(propertyKey));
    }

    Manifest.recordMap(target.constructor, propertyKey, { path, options });
  }
}
function createMap<InputType = string>(requestKey:string, options:MapOptions<InputType>);
function createMap<InputType = string>(requestKey:string, key?:string, options?:MapOptions<InputType>);
function createMap<InputType = string>(requestKey:string, key?:any, options?:any) {
  const path = [requestKey];

  if(typeof key === 'string') {
    path.push(key);
    return Map(path, options);
  }

  return Map(path, key);
}
export function Query<InputType = string>(options?:MapOptions<InputType>);
export function Query<InputType = string>(key:string, options?:MapOptions<InputType>);
export function Query<InputType = string>(key?:any, options?:any) {
  return createMap('query', key, options);
}

export function Body<InputType = string>(options?:MapOptions<InputType>);
export function Body<InputType = string>(key:string, options?:MapOptions<InputType>);
export function Body<InputType = string>(key?:any, options?:any) {
  return createMap('body', key, options);
}

export function Header<InputType = string>(options?:MapOptions<InputType>);
export function Header<InputType = string>(key:string, options?:MapOptions<InputType>);
export function Header<InputType = string>(key?:any, options?:any) {
  return createMap('headers', key, options);
}

export function Cookie<InputType = string>(options?:MapOptions<InputType>);
export function Cookie<InputType = string>(key:string, options?:MapOptions<InputType>);
export function Cookie<InputType = string>(key?:any, options?:any) {
  return createMap('cookies', key, options);
}

export function Param<InputType = string>(options?:MapOptions<InputType>);
export function Param<InputType = string>(key:string, options?:MapOptions<InputType>);
export function Param<InputType = string>(key?:any, options?:any) {
  return createMap('params', key, options);
}
