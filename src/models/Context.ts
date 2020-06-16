import {Request, Response} from "express";

export default class Context<ContainerT> {
  constructor(
    public request:Request,
    public response:Response,
    public container:IChildContainer<ContainerT>
  ) { }
}