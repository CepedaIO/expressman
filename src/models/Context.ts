import {Request, Response} from "express";
import Container from "./Container";

export default class Context<ContainerT> {
  constructor(
    public request:Request,
    public response:Response,
    public container:Container<ContainerT>
  ) { }
}