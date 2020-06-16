import {Request, Response, NextFunction} from "express";
import Context from "../models/Context";
import tokens from "../tokens";
import Manifest from "../services/Manifest";

export default function ContainerMiddleware<ContainerT>(req: Request, resp: Response, next: NextFunction) {
  const container = Manifest.container.create();

  container.bindValue(Context, new Context(req, resp, container));
  container.bindValue<Request>(tokens.Request, req);
  container.bindValue<Response>(tokens.Response, resp);

  resp.locals.container = container;

  next();
}
