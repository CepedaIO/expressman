import { expect } from "chai";
import {API, Route} from "../decorators";
import {Swagger} from "../decorators/Swagger/Swagger";
import {generateSwaggerAPI} from "./generateSwaggerAPI";
import {programFor} from "./generateSwagger";

describe("generateSwaggerAPI", function() {
  it('should generate swagger documentation', async function() {
    const program = await programFor('src/**/*.specs.ts');
    this.timeout(0);
    class CUTInput {
      firstname: string;
      lastname: string;
    }
    
    class CUTOutput {
      member: boolean;
    }
    
    @API('/')
    class CUT {
      constructor() {}
    
      @Swagger()
      @Route('GET', '/json-response')
      getJSONResponse(payload: CUTInput): CUTOutput {
        return { member: true };
      }
    }
    
    const swagger = await generateSwaggerAPI(program);
    
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