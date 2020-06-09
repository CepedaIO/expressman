import {Request, Response, NextFunction} from "express";
import Context from "../models/Context";
import tokens from "../tokens";
import Container from "../models/Container";

export default function ContainerMiddleware<ContainerT>(containerProvider:IContainerProvider<ContainerT>) {
  return (req: Request, resp: Response, next: NextFunction) => {
    const consumerContainer = containerProvider.create();
    const container = new Container(consumerContainer);

    container.bind(Context, new Context(req, resp, container));
    container.bind<Container<ContainerT>>(Container, container);

    container.bind<Request>(tokens.Request, req);
    container.bind<Response>(tokens.Response, resp);
    container.bind<ContainerT>(tokens.Container, consumerContainer.raw);

    next();
  }
}
