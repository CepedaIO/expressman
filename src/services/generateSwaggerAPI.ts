import "reflect-metadata"
import * as TJS from "typescript-json-schema";
import * as path from "path";
import SwaggerMetadata from "./metadata/SwaggerMetadata";
import RouteMetadata from "./metadata/RouteMetadata";
import glob from "glob";
import {GenerateSwaggerOptions} from "./generateSwagger";

const cache:Map<string, TJS.Program> = new Map();

async function programFor(routePattern:string, options:GenerateSwaggerOptions = {}): Promise<TJS.Program> {
  return new Promise(async (resolve, reject) => {
    const pattern = `${process.cwd()}/${routePattern}`;
    console.log(pattern);
    let excludedFiles:string[] = [];
    
    if(cache.has(pattern)) {
      resolve(cache.get(pattern));
    }
    
    if(options.exclude) {
      const excludePattern = `${process.cwd()}/${options.exclude}`;
      excludedFiles = await new Promise((resolve, reject) => {
        glob(excludePattern, (err, files) => {
          if(err) { return reject(err); }
          resolve(files);
        });
      });
    }
    
    glob(pattern, (err, files) => {
      if(err) { return reject(err); }
      const excludedSet = new Set(excludedFiles.values());
      const remaining = files.filter(file => !excludedSet.has(file) && !file.includes('.d.ts'));
      remaining.forEach(file => {
        console.log(file);
        require(file)
      });
      const program = TJS.getProgramFromFiles(remaining, {
        esModuleInterop: true
      });
      cache.set(pattern, program);
      resolve(program);
    });
  });
}

export async function generateSwaggerAPI(pattern:string, options: GenerateSwaggerOptions = {}) {
  const program = await programFor(pattern, options);
  const paths = {};
  const schemas = {};
  
  SwaggerMetadata.swaggers.forEach((swaggerApi) => {
    const api = RouteMetadata.apis.get(swaggerApi.target)!;
    
    swaggerApi.routes.forEach((swaggerRoute) => {
      const route = api.routes.get(swaggerRoute.property)!;
      const inputSchema = swaggerRoute.input ? TJS.generateSchema(program, swaggerRoute.input.name) : null;
      const outputSchema = swaggerRoute.output ? TJS.generateSchema(program, swaggerRoute.output.name) : null;
      
      const url = path.normalize(`${api.basePath}/${route.path}`);
      
      if(inputSchema) {
        schemas[swaggerRoute.input.name] = inputSchema;
      }
      
      if(outputSchema) {
        schemas[swaggerRoute.output.name] = outputSchema;
      }
      
      if(!paths[url]) {
        paths[url] = {};
      }
      
      paths[url][route.method] = {
        operationId: route.property,
        responses: {
          200: {
            content: {
              "application/json": {
                schema: {
                  $ref: `#/components/schemas/${swaggerRoute.input.name}`
                }
              }
            }
          }
        }
      };
    });
  });
  
  return {
    paths,
    components: { schemas }
  };
}