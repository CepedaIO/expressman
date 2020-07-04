import {Request, Response} from "express";
import {inject, injectable} from "tsyringe";
import {tokens} from "../tokens";

@injectable()
export default class Context<ContainerT> {
  constructor(
    @inject(tokens.Request) public request:Request,
    @inject(tokens.Response) public response:Response,
    @inject(tokens.Container) public container:IChildContainer<ContainerT>
  ) { }
}