import {MapOptions} from "./decorators";
import {RequestHandler} from "express";
import {DependencyContainer} from "tsyringe";

export interface Newable<InstanceType> {
  new (...args: any[]): InstanceType;
}
export type AnyNewable = { new(...args: any[]): {} };

export interface IContainer<ContainerT> {
  bindValue<T>(token:Newable<T> | symbol, value:T);
  resolve<T>(token:Newable<T> | symbol);
}

export type IChildContainer<ContainerT> = IContainer<ContainerT>;

export interface IParentContainer<ContainerT> extends IContainer<ContainerT> {
  create():IChildContainer<ContainerT>;
}

export interface IHTTPResponse<U> {
  statusCode?: number;
  contentType?: string;
  body: U;
}

export type RouteHandlerNewable<IPayloadType, IResponseType> = Newable<IRouteHandler<IPayloadType, IResponseType>>;
export type AnyRouteHandlerNewable = RouteHandlerNewable<any, any>;

export interface IRouteHandler<IPayload, IResponse> {
  catch?(err:Error): IResponse;
  handle(payload:IPayload): IResponse;
}

export interface PropertyMapOptions<InputType = string>{
  path:string[];
  options:MapOptions
}

export type InputMap = {
  [propertyName:string]:PropertyMapOptions<any>;
};

export type Pairs<ValueType = string | number, KeyType extends string | number = string,> = {
  [key in string | number]: ValueType;
};

export interface JSON {
  [key:string]: string | number | JSON;
}

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<T>;
export type Require<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
export type HandlerError = Error | Error[] | Pairs<Error | Error[]>;
export type Middleware<IRequest = never, IResponse = never> = RequestHandler;
export type Wrapperware = (container: DependencyContainer, next: () => Promise<any>) => Promise<any>;