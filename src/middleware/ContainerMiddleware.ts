import {Request, Response, NextFunction} from "express";
import tokens from "../tokens";
import {container} from "tsyringe";

export default function ContainerMiddleware(req: Request, resp: Response, next: NextFunction) {
  const child = container.createChildContainer();

  child.register(tokens.Request, { useValue: req });
  child.register(tokens.Response, { useValue: resp });
  child.register(tokens.Container, { useValue: child });

  resp.locals.container = child;

  next();
  return child;
}
