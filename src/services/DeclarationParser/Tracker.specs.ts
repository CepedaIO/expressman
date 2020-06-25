import {expect} from "chai";
import {JSONFromType} from "./JSONFromType";
import project from "../../tests/TestProject";
import {Tracker} from "./Tracker";

describe('Tracker', function() {
  this.timeout(0);

  it('should track references', function() {
    const tracker = new Tracker();
    const sourceFile = project.getSourceFile('src/tests/DeclarationParser/JSONFromType/InterfaceWithNestedInterface.ts')!;
    const interfaceDef = sourceFile.getInterfaces()[1];
    const interfaceJSON = JSONFromType(interfaceDef.getType(), tracker);

    expect(tracker.references.get('NestedInterface')!.json).to.deep.equal({
      firstname: 'string'
    });

    expect(tracker.references.get('InterfaceWIthNestedInterface')!.json).to.deep.equal({
      id: 'number',
      contact: 'NestedInterface'
    });
  });

  it.only('should track generic references', function() {
    const tracker = new Tracker();
    const sourceFile = project.getSourceFile('src/tests/DeclarationParser/JSONFromType/InterfaceWithGenericInterface.ts')!;
    const interfaceDef = sourceFile.getInterface('InterfaceWithGenericInterface')!;
    const interfaceJSON = JSONFromType(interfaceDef.getType(), tracker);

    console.log(tracker.references.get('Partial<NestedInterface>'));
    debugger;
  });
});