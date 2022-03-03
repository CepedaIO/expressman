import "reflect-metadata"
import * as path from "path";
import RouteMetadata, {RouteDescriptor, urlFrom} from "./metadata/RouteMetadata";

export async function generateSwaggerAPI() {
  const paths = {};
  const schemas = {};
  
  RouteMetadata.apis.forEach((api) => {
    api.routes.forEach((route, url) => {
      if(route.schema.input) {
        schemas[route.schema.input.name] = route.schema.input.schema;
      }
  
      if(route.schema.output) {
        schemas[route.schema.output.name] = route.schema.output.schema;
      }
  
      if(!paths[url]) {
        paths[url] = {};
      }
  
      const routeDef = {
        operationId: route.property,
        tags: [api.target.name]
      };
  
      addRequestBody(routeDef, route);
      addResponses(routeDef, route);
  
      paths[url][route.schema.method] = routeDef;
    });
  })
  
  return {
    paths,
    components: { schemas }
  };
}

function addRequestBody(route, descriptor:RouteDescriptor) {
  if(descriptor.schema.input) {
    route.requestBody = {
      content: {
        'application/json': {
          schema: {
            $ref: `#/components/schemas/${descriptor.schema.input.name}`
          }
        }
      }
    };
  }
}

function addResponses(route, descriptor:RouteDescriptor) {
  if(descriptor.schema.output) {
    route.responses = {
      200: {
        content: {
          'application/json': {
            schema: {
              $ref: `#/components/schemas/${descriptor.schema.output.name}`
            }
          }
        }
      }
    }
  }
}