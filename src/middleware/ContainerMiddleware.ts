import {Request, Response, NextFunction} from "express";
import {tokens} from "../tokens";
import {container} from "tsyringe";
import {ManifestOptions} from "../services/metadata/RouteMetadata";

export default function ContainerMiddleware(options:ManifestOptions = {}) {
  return (req: Request, resp: Response, next: NextFunction) => {
    const child = container.createChildContainer();

    child.register(tokens.Request, {useValue: req});
    child.register(tokens.Response, {useValue: resp});
    child.register(tokens.Container, {useValue: child});

    resp.locals.container = child;

    if(options.configureContainer) {
      options.configureContainer(child, req, resp);
    }

    return next();
  };
}
