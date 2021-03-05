import "reflect-metadata"
import * as TJS from "typescript-json-schema";
import * as path from "path";
import SwaggerMetadata, {SwaggerRouteDescriptor} from "./metadata/SwaggerMetadata";
import RouteMetadata from "./metadata/RouteMetadata";
import gatherSymbols from "../utils/gatherSymbols";

export async function generateSwaggerAPI(program:TJS.Program) {
  const paths = {};
  const schemas = {};
  
  const generator = TJS.buildGenerator(program)!;
  
  SwaggerMetadata.swaggers.forEach((swaggerApi) => {
    const api = RouteMetadata.apis.get(swaggerApi.target)!;
    const fileSymbols = gatherSymbols(api.filePath);
    
    swaggerApi.routes.forEach((swaggerRoute) => {
      const route = api.routes.get(swaggerRoute.property)!;
      const symbols = fileSymbols.methods.get(route.property)!;
      const inputSchema = symbols.arg ? generator.getSchemaForSymbol(symbols.arg) : null;
      const outputSchema = symbols.return ? generator.getSchemaForSymbol(symbols.return) : null;
      const url = path.normalize(`${api.path}/${route.path}`);

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