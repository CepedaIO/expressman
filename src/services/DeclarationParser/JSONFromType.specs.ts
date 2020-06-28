import {expect} from "chai";
import {JSONFromType} from "./JSONFromType";
import project from "../../tests/TestProject";

describe('JSONFromType', function() {
  this.timeout(0);

  it('should json a simple interface', function() {
    const sourceFile = project.getSourceFile('src/tests/DeclarationParser/JSONFromType/SimpleInterface.ts')!;
    const interfaceDef = sourceFile.getInterfaces()[0];
    const interfaceJSON = JSONFromType(interfaceDef.getType());

    expect(interfaceJSON).to.deep.equal({
      firstname: 'string',
      age: 'number',
      nothing: 'null',
      notdefined: 'undefined',
      literalstr: 'literalstring',
      literalnum: '1',
      active: 'boolean',
      literaltrue: 'true',
      literalfalse: 'false'
    });
  });

  it('should json an interface with nested object declaration', function() {
    const sourceFile = project.getSourceFile('src/tests/DeclarationParser/JSONFromType/InterfaceWithObject.ts')!;
    const interfaceDef = sourceFile.getInterfaces()[0];
    const interfaceJSON = JSONFromType(interfaceDef.getType());

    expect(interfaceJSON).to.deep.equal({
      id: 'string',
      contact: {
        firstname: 'string'
      }
    });
  });

  it('should json an interface with as nested interface declaration', function() {
    const sourceFile = project.getSourceFile('src/tests/DeclarationParser/JSONFromType/InterfaceWithNestedInterface.ts')!;
    const interfaceDef = sourceFile.getInterfaces()[1];
    const interfaceJSON = JSONFromType(interfaceDef.getType());

    expect(interfaceJSON).to.deep.equal({
      id: 'number',
      contact: 'NestedInterface'
    });
  });

  it('should json an interface with a nested generic interface declaration', function() {
    const sourceFile = project.getSourceFile('src/tests/DeclarationParser/JSONFromType/InterfaceWithGenericInterface.ts')!;
    const interfaceDef = sourceFile.getInterface('InterfaceWithGenericInterface')!;
    const interfaceJSON = JSONFromType(interfaceDef.getType());

    expect(interfaceJSON).to.deep.equal({
      id: 'number',
      contact: 'Partial<NestedInterface>'
    });
  });

  it('should json an interface with a nested imported interface declaration', function() {
    const sourceFile = project.getSourceFile('src/tests/DeclarationParser/Tracker/InterfaceWIthNestedImportedInterface.ts')!;
    const interfaceDef = sourceFile.getInterface('InterfaceWithNestedImportedInterface')!;
    const interfaceJSON = JSONFromType(interfaceDef.getType());

    expect(interfaceJSON).to.deep.equal({
      field1:'string',
      imported:'ImportedInterface'
    });
  });
});