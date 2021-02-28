import "reflect-metadata"
import * as TJS from "typescript-json-schema";
import * as path from "path";
import SwaggerMetadata, {SwaggerRouteDescriptor} from "./metadata/SwaggerMetadata";
import RouteMetadata from "./metadata/RouteMetadata";

export async function generateSwaggerAPI(program:TJS.Program) {
  const paths = {};
  const schemas = {};
  
  const generator = TJS.buildGenerator(program)!;
  SwaggerMetadata.swaggers.forEach((swaggerApi) => {
    const api = RouteMetadata.apis.get(swaggerApi.target)!;
    
    swaggerApi.routes.forEach((swaggerRoute) => {
      const route = api.routes.get(swaggerRoute.property)!;
      const inputSchema = swaggerRoute.input ? generator.getSchemaForSymbol(swaggerRoute.input.name) : null;
      const outputSchema = swaggerRoute.output ? generator.getSchemaForSymbol(swaggerRoute.output.name) : null;
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
      
      const routeDef = {
        operationId: route.property,
      };
      
      addRequestBody(routeDef, swaggerRoute);
      addResponses(routeDef, swaggerRoute);
      
      paths[url][route.method] = routeDef;
    });
  });
  
  return {
    paths,
    components: { schemas }
  };
}

function addRequestBody(route, swaggerRoute:SwaggerRouteDescriptor) {
  if(swaggerRoute.input) {
    route.requestBody = {
      content: {
        'application/json': {
          schema: {
            $ref: `#/components/schemas/${swaggerRoute.input.name}`
          }
        }
      }
    };
  }
}

function addResponses(route, swaggerRoute:SwaggerRouteDescriptor) {
  if(swaggerRoute.output) {
    route.responses = {
      200: {
        content: {
          'application/json': {
            schema: {
              $ref: `#/components/schemas/${swaggerRoute.output.name}`
            }
          }
        }
      }
    }
  }
}