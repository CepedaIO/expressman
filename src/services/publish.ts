import {Application, Request, Response} from "express";
import glob = require("glob");
import RouteMetadata from "./metadata/RouteMetadata";
import DependencyContainer from "tsyringe/dist/typings/types/dependency-container";
import {Middleware} from "../types";
import {generateSwagger, SwaggerOptions} from "./generateSwagger";
import SwaggerMetadata from "./metadata/SwaggerMetadata";
const swaggerUI = require('swagger-ui-express');

interface PublishOptions {
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
      RouteMetadata.generateRoutes(app, options);
      
      if(SwaggerMetadata.hasMetadata() && !options.swagger) {
        console.warn('Swagger metadata encountered but no swagger config defined');
      }
      
      if(options.swagger && !SwaggerMetadata.hasMetadata()) {
        console.warn('Swagger config encountered but no swagger metadata defined');
      }
      
      if(SwaggerMetadata.hasMetadata() && options.swagger) {
        console.log('Swagger data encountered, deploying SwaggerUI');
        const swaggerDocument = await generateSwagger(options.pattern, options.swagger);
        app.use(options.swagger.path, swaggerUI.serve);
        app.get(options.swagger.path, swaggerUI.setup(swaggerDocument));
      }
      
      resolve({
        app, files
      });
    });
  });
}
