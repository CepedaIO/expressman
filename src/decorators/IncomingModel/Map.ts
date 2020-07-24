import Manifest from "../../services/Manifest";
import { kebabCase } from 'lodash';

export interface MapOptions<InputType = any, TransformType = any> {
  transform?(input:InputType): TransformType;
  validate?(input:InputType, transformed:TransformType): void | Promise<void>;
}

export function Map<InputType = string>(path:string[], options:MapOptions<InputType> = {}) {
  return (target:any, propertyKey: string) => {
    if(path.length === 1) {
      path.push(kebabCase(propertyKey));
    }

    Manifest.recordMap(target.constructor, propertyKey, { path, options });
  }
}

export function Query<InputType = string>(key?:string, options:MapOptions<InputType> = {}) {
  const path = ['query'];
  if(key) path.push(key);
  return Map(path, options);
}

export function Body<InputType = string>(key?:string, options:MapOptions<InputType> = {}) {
  const path = ['body'];
  if(key) path.push(key)
  return Map(path, options);
}

export function Header<InputType = string>(key?:string, options:MapOptions<InputType> = {}) {
  const path = ['headers'];
  if(key) path.push(key)
  return Map(path, options);
}

export function Cookie<InputType = string>(key:string, options:MapOptions<InputType> = {}) {
  const path = ['cookies'];
  if(key) path.push(key)
  return Map(path, options);
}

export function Param<InputType = string>(key:string, options:MapOptions<InputType> = {}) {
  const path = ['params'];
  if(key) path.push(key)
  return Map(path, options);
}
