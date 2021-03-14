import { expect } from "chai";
import {API, Route} from "../decorators";
import {generateSwaggerAPI} from "./generateSwaggerAPI";
import {programFor} from "./generateSwagger";
import RouteMetadata from "./metadata/RouteMetadata";
import express = require('express');

describe("generateSwaggerAPI", function() {
  it('should generate swagger documentation from classes', async function() {
    this.timeout(0);
    class CUTInput {
      firstname: string;
      lastname: string;
    }
    
    class CUTOutput {
      member: boolean;
    }
    
    @API('/')
    class GenerateSwaggerAPI {
      constructor() {}
    
      @Route('GET', '/json-response')
      getJSONResponse(payload: CUTInput): CUTOutput {
        return { member: true };
      }
    }
  
    const app = express();
    const program = await programFor('**/*.specs.ts')
    await RouteMetadata.generateRoutes(app, program, {pattern: "**/*.specs.ts"});
    const swagger = await generateSwaggerAPI();
    
    expect(swagger.paths).to.have.nested.include({'/json-response.get.operationId': 'getJSONResponse' });
    expect(swagger.paths).to.have.nested.include({'/json-response.get.responses.200.content.application/json.schema.$ref': '#/components/schemas/CUTOutput' });
    expect(swagger.paths).to.have.nested.include({'/json-response.get.requestBody.content.application/json.schema.$ref': '#/components/schemas/CUTInput'});
    expect(swagger.components).to.have.nested.include({'schemas.CUTInput.type': 'object' });
    expect(swagger.components).to.have.nested.include({'schemas.CUTInput.properties.firstname.type': 'string' });
    expect(swagger.components).to.have.nested.include({'schemas.CUTInput.properties.lastname.type': 'string' });
    expect(swagger.components).to.have.nested.include({'schemas.CUTOutput.type': 'object' });
    expect(swagger.components).to.have.nested.include({'schemas.CUTOutput.properties.member.type': 'boolean' });
  });
});