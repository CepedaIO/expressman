import {Application, Request, Response} from "express";
import glob = require("glob");
import RouteMetadata from "./metadata/RouteMetadata";
import DependencyContainer from "tsyringe/dist/typings/types/dependency-container";
import {Middleware} from "../types";
import {generateSwagger, programFor, SwaggerOptions} from "./generateSwagger";
const swaggerUI = require('swagger-ui-express');

export interface PublishOptions {
  pattern: string;
  swagger?: SwaggerOptions;
  before?: Array<Middleware>;
  after?: Array<Middleware>;
  configureContainer?(container:DependencyContainer, request:Request, response:Response);
  onUncaughtException?(container:DependencyContainer, error:any);
}

export async function publish<U>(app:Application, options:PublishOptions) {
  return new Promise( (resolve, reject) => {
    glob(options.pattern, async (err, files) => {
      if(err) return reject(err);
      if(files.length === 0) return reject(new Error('No routes found'));
      
      files.forEach(file => require(`${process.cwd()}/${file}`));
      const program = await programFor(options.pattern)
      await RouteMetadata.generateRoutes(app, program, options);
      const result = {
        app, files, swagger:undefined
      };
      
      if(options.swagger) {
        result.swagger = await generateSwagger(options.pattern, options.swagger);
        app.use(options.swagger.path, swaggerUI.serve);
        app.get(options.swagger.path, swaggerUI.setup(result.swagger));
      }
      
      resolve(result);
    });
  });
}
