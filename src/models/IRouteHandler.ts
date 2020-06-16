import {Request, Response} from "express";

export interface RouteHandlerConstructor<ReturnType = any, ContainerType = any> {
  new (...args: any[]): IRouteHandler<ReturnType, ContainerType>;
  before?:RouteHandlerConstructor[];
  after?:RouteHandlerConstructor[];
}

export interface IRouteHandler<ReturnType, ContainerType> {
  catch?(err:Error): ReturnType | IHTTPResponse<ReturnType> | undefined | null;
  handle(req:Request, resp:Response, container:ContainerType): ReturnType |  IHTTPResponse<ReturnType> | null;
}