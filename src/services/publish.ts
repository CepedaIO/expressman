import {Application, Request, Response} from "express";
import glob = require("glob");
import RouteMetadata from "./metadata/RouteMetadata";
import DependencyContainer from "tsyringe/dist/typings/types/dependency-container";
import {Middleware} from "../types";
import {generateSwagger, programFor, SwaggerOptions} from "./generateSwagger";
const swaggerUI = require('swagger-ui-express');

export interface PublishOptions {
  pattern: string;
  bodyparser?: boolean; /** true by default, expressman then provides body parser rules **/
  swagger?: SwaggerOptions;
  before?: Array<Middleware>;
  after?: Array<Middleware>;
  metadata?: {
    path?: string;
  };
  configureContainer?(container:DependencyContainer, request:Request, response:Response);
  onUncaughtException?(container:DependencyContainer, error:any);
}

export interface PublishResult {
  app: Application,
  files: string[],
  swagger?: Object
}

export async function publish<U>(app:Application, options:PublishOptions): Promise<PublishResult> {
  return new Promise( (resolve, reject) => {
    glob(options.pattern, async (err, files) => {
      if(err) return reject(err);
      if(files.length === 0) return reject(new Error('No routes found'));
      
      files.forEach(file => require(`${process.cwd()}/${file}`));

      await RouteMetadata.generateRoutes(app, options);
      await RouteMetadata.generateSchemas(options.pattern);

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
