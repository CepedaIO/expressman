import project from "../../tests/TestProject";
import {expect} from "chai";
import {definitionFromClass} from "./definitionFromClass";

describe('JSONFromClass', function() {
  this.timeout(0);

  it('should create definition of InlineDefinition', function() {
    const sourceFile = project.getSourceFile('src/tests/DeclarationParser/JSONFromClass/InlineDefinition.ts')!;
    const classDef = sourceFile.getClass('InlineDefinition')!;

    const result = definitionFromClass(classDef);

    expect(result).to.deep.equal({
      return: {
        type: 'object',
        definition: {
          success: 'boolean'
        }
      },
      parameter: {
        type: 'object',
        definition: {
          firstname: 'string'
        }
      }
    });
  });

  it('should json a RouterHandler class', function() {
    const sourceFile = project.getSourceFile('src/tests/DeclarationParser/JSONFromClass/InterfaceDefinition.ts')!;
    const classDef = sourceFile.getClass('InterfaceDefinition')!;

    const result = definitionFromClass(classDef);

    expect(result).to.deep.equal({
      return: {
        type: 'object',
        definition: {
          success: 'boolean'
        }
      },
      parameter: {
        type: 'object',
        definition: {
          firstname: 'string'
        }
      }
    });
  });

  it('should json a RouterHandler class', function() {
    const sourceFile = project.getSourceFile('src/tests/DeclarationParser/JSONFromClass/InlineDefinition.ts')!;
    const classDef = sourceFile.getClass('InlineDefinition')!;

    const result = definitionFromClass(classDef);

    expect(result).to.deep.equal({
      return: {
        type: 'object',
        definition: {
          success: 'boolean'
        }
      },
      parameter: {
        type: 'object',
        definition: {
          firstname: 'string'
        }
      }
    });
  });
});