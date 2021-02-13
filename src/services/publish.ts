import {Application, Request, Response} from "express";
import glob = require("glob");
import Manifest from "./RouteMetadata";
import DependencyContainer from "tsyringe/dist/typings/types/dependency-container";
import {Middleware} from "../types";

interface PublishOptions {
  routeDir: string;
  before?: Array<Middleware>;
  after?: Array<Middleware>;
  configureContainer?(container:DependencyContainer, request:Request, response:Response);
  onUncaughtException?(container:DependencyContainer, error:any);
}

interface PublishResult {
  app:Application,
  files:string[]
}

export function publish<U>(app:Application, options:PublishOptions): Promise<PublishResult> {
  return new Promise((resolve, reject) => {
    glob(`${process.cwd()}/${options.routeDir}/**/*.ts`, (err, files) => {
      if(err) reject(err);

      files.forEach(file => require(file));
      Manifest.generateRoutes(app, options);
      resolve({
        app, files
      });
    });
  });
}
