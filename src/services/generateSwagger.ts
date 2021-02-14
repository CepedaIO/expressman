import "reflect-metadata"
import * as TJS from "typescript-json-schema";
import * as path from "path";
import SwaggerMetadata from "./metadata/SwaggerMetadata";
import RouteMetadata from "./metadata/RouteMetadata";

export function generateSwagger(program: TJS.Program) {
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
    components: {
      schemas
    }
  };
}