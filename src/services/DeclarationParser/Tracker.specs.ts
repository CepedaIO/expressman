import {resolve} from "path";
import {expect} from "chai";
import {JSONFromType} from "./JSONFromType";
import project from "../../tests/TestProject";
import {Tracker} from "./Tracker";

describe('Tracker', function() {
  let tracker:Tracker;
  this.timeout(0);

  beforeEach(function() {
    tracker = new Tracker();
  });

  it('should track references', function() {
    const sourceFile = project.getSourceFile('src/tests/DeclarationParser/JSONFromType/InterfaceWithNestedInterface.ts')!;
    const interfaceDef = sourceFile.getInterfaces()[1];

    const interfaceJSON = JSONFromType(interfaceDef.getType(), tracker);

    expect(tracker.types.get('NestedInterface')!.json).to.deep.equal({
      firstname: 'string'
    });

    expect(interfaceJSON).to.deep.equal({
      id: 'number',
      contact: 'NestedInterface'
    });
  });

  it.skip('should track generic references', function() {
    const sourceFile = project.getSourceFile('src/tests/DeclarationParser/JSONFromType/InterfaceWithGenericInterface.ts')!;
    const interfaceDef = sourceFile.getInterface('InterfaceWithGenericInterface')!;
    const interfaceJSON = JSONFromType(interfaceDef.getType(), tracker);

    console.log(tracker.types.get('Partial<NestedInterface>'));
    /* TODO: Figure out how to get generic types out */
  });

  it('should json an interface with a nested imported interface declaration', function() {
    const sourceFile = project.getSourceFile('src/tests/DeclarationParser/Tracker/InterfaceWIthNestedImportedInterface.ts')!;
    const interfaceDef = sourceFile.getInterface('InterfaceWithNestedImportedInterface')!;
    const interfaceJSON = JSONFromType(interfaceDef.getType(), tracker);

    const needsResolve = tracker.resolve.entries().next().value;
    expect(needsResolve).to.deep.equal([
      resolve(__dirname + '/../../tests/DeclarationParser/Tracker/ImportedInterface'),
      ['ImportedInterface']
    ]);

    expect(interfaceJSON).to.deep.equal({
      field1:'string',
      imported:'ImportedInterface'
    });
  });
});