import Manifest from "../../services/Manifest";

export interface MapOptions<InputType = any, TransformType = any> {
  transform?(input:InputType): TransformType;
  validate?(input:InputType, transformed:TransformType): void | Promise<void>;
}

export function Map<InputType = string>(path:string, options:MapOptions<InputType> = {}) {
  return (target:any, propertyKey: string) => {
    Manifest.recordMap(target.constructor, propertyKey, { path, options });
  }
}

export function Query<InputType = string>(key:string, options:MapOptions<InputType> = {}) {
  return Map(`query.${key}`, options);
}

export function Body<InputType = string>(key:string, options:MapOptions<InputType> = {}) {
  return Map(`body.${key}`, options);
}

export function Header<InputType = string>(key:string, options:MapOptions<InputType> = {}) {
  return Map(`headers.${key}`, options);
}

export function Cookie<InputType = string>(key:string, options:MapOptions<InputType> = {}) {
  return Map(`cookies.${key}`, options);
}

export function Param<InputType = string>(key:string, options:MapOptions<InputType> = {}) {
  return Map(`params.${key}`, options);
}
